import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { initializeTracking, trackRecommendationView } from '@/utils/dataTracking';
import { synthesizeBusinessData } from '@/utils/dataUnification';
import { generateAdaptiveRecommendations } from '@/utils/adaptiveRecommendations';
import { supabase } from '@/integrations/supabase/client';

export const useIntelligenceIntegration = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Initialize tracking system
      const tracker = initializeTracking(user.id);
      
      // Set up real-time updates for profile changes
      setupRealtimeUpdates();
      
      // Initial data synthesis
      triggerInitialAnalysis();
    }
  }, [user]);

  const setupRealtimeUpdates = () => {
    if (!user) return;

    // Listen for profile updates
    const profileChannel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Profile updated, triggering intelligence refresh');
          await refreshIntelligence();
        }
      )
      .subscribe();

    // Listen for AI preference changes
    const aiPrefsChannel = supabase
      .channel('ai-prefs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_preferences',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('AI preferences updated, refreshing recommendations');
          await refreshRecommendations();
        }
      )
      .subscribe();

    // Listen for website analysis updates
    const websiteChannel = supabase
      .channel('website-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_analysis',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Website analysis updated, generating recommendations');
          await generateWebsiteBasedRecommendations();
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(aiPrefsChannel);
      supabase.removeChannel(websiteChannel);
    };
  };

  const triggerInitialAnalysis = async () => {
    if (!user) return;

    try {
      // Check if user has existing analysis
      const { data: existingAnalysis } = await supabase
        .from('unified_business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!existingAnalysis || shouldRefreshAnalysis(existingAnalysis.last_updated)) {
        await refreshIntelligence();
      }
    } catch (error) {
      console.error('Error in initial analysis:', error);
    }
  };

  const refreshIntelligence = async () => {
    if (!user) return;

    try {
      // Synthesize all business data
      const unifiedProfile = await synthesizeBusinessData(user.id);
      
      // Update unified business profile
      await supabase
        .from('unified_business_profiles')
        .upsert({
          user_id: user.id,
          profile_data: unifiedProfile as any,
          intelligence_score: calculateIntelligenceScore(unifiedProfile),
          last_updated: new Date().toISOString()
        }, { onConflict: 'user_id' });

      // Generate new adaptive recommendations
      await refreshRecommendations();

    } catch (error) {
      console.error('Error refreshing intelligence:', error);
    }
  };

  const refreshRecommendations = async () => {
    if (!user) return;

    try {
      // Get current unified profile
      const unifiedProfile = await synthesizeBusinessData(user.id);
      
      // Generate adaptive recommendations
      await generateAdaptiveRecommendations(user.id, {
        unifiedProfile,
        userBehavior: await getUserBehavior(),
        industryBenchmarks: getIndustryBenchmarks(unifiedProfile.businessInfo.industry)
      });

    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    }
  };

  const generateWebsiteBasedRecommendations = async () => {
    if (!user) return;

    try {
      // Get latest website analysis
      const { data: websiteAnalysis } = await supabase
        .from('website_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('last_analyzed', { ascending: false })
        .limit(1)
        .single();

      if (websiteAnalysis && websiteAnalysis.recommendations && Array.isArray(websiteAnalysis.recommendations)) {
        // Convert website recommendations to enhanced recommendations
        for (const rec of websiteAnalysis.recommendations as any[]) {
          await supabase
            .from('enhanced_recommendations')
            .upsert({
              user_id: user.id,
              recommendation_id: `website-${rec.type}-${Date.now()}`,
              recommendation_type: 'website_optimization',
              hook: `🌐 ${rec.title}`,
              content: {
                title: rec.title,
                description: rec.description,
                expectedImpact: rec.impact,
                timeToImplement: '2-3 hours',
                steps: getWebsiteImplementationSteps(rec),
                metrics: ['Website traffic', 'Conversion rate', 'Search rankings']
              },
              priority_score: rec.priority === 'high' ? 85 : 70,
              personalized_score: 95,
              confidence_score: 88,
              reasoning: `Based on website analysis findings`,
              expected_impact: rec.impact,
              time_to_implement: '2-3 hours',
              stream_type: 'forYou',
              is_active: true
            }, { onConflict: 'user_id,recommendation_id' });
        }
      }
    } catch (error) {
      console.error('Error generating website recommendations:', error);
    }
  };

  const shouldRefreshAnalysis = (lastUpdated: string): boolean => {
    const lastUpdate = new Date(lastUpdated);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    
    // Refresh if older than 24 hours
    return hoursSinceUpdate > 24;
  };

  const calculateIntelligenceScore = (profile: any): number => {
    let score = 0;
    
    // Data completeness (40 points)
    if (profile.businessInfo.company_name) score += 10;
    if (profile.businessInfo.industry) score += 10;
    if (profile.quizInsights.chaosScore > 0) score += 20;
    
    // Data quality (30 points)
    score += Math.round(profile.financialData.confidence * 0.1);
    score += Math.round(profile.customerData.confidence * 0.1);
    score += Math.round(profile.scheduleData.confidence * 0.1);
    
    // Integration depth (30 points)
    const integrationCount = [
      profile.financialData.source !== 'none',
      profile.customerData.source !== 'none',
      profile.scheduleData.source !== 'none'
    ].filter(Boolean).length;
    
    score += integrationCount * 10;
    
    return Math.min(100, score);
  };

  const getUserBehavior = async () => {
    const { data: engagements } = await supabase
      .from('user_engagement')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: profile } = await supabase
      .from('profiles')
      .select('chaos_score')
      .eq('user_id', user?.id)
      .single();

    return {
      engagementPatterns: engagements?.map(e => e.event_type) || [],
      implementationRate: 0.7, // Would be calculated from actual data
      preferredComplexity: 'moderate' as const,
      growthAmbition: (profile?.chaos_score || 50) > 70 ? 'maintain' : 
                     (profile?.chaos_score || 50) > 40 ? 'grow' : 'scale'
    } as const;
  };

  const getIndustryBenchmarks = (industry: string) => {
    const benchmarks = {
      'construction': {
        financial: { averageRevenue: 25000, averageExpenses: 18000 },
        sales: { averageConversionRate: 15, averageDealSize: 5000 }
      },
      'consulting': {
        financial: { averageRevenue: 15000, averageExpenses: 8000 },
        sales: { averageConversionRate: 25, averageDealSize: 2500 }
      }
    };

    return benchmarks[industry as keyof typeof benchmarks] || benchmarks.consulting;
  };

  const getWebsiteImplementationSteps = (rec: any): string[] => {
    switch (rec.type) {
      case 'seo':
        return ['Audit current SEO', 'Research keywords', 'Update meta tags', 'Monitor rankings'];
      case 'conversion':
        return ['Identify conversion points', 'Design CTAs', 'A/B test', 'Monitor results'];
      case 'design':
        return ['Test on devices', 'Fix responsive issues', 'Optimize performance', 'User testing'];
      default:
        return ['Analyze', 'Plan', 'Implement', 'Monitor'];
    }
  };

  return {
    refreshIntelligence,
    refreshRecommendations,
    generateWebsiteBasedRecommendations
  };
};