import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RoutingAnalysis {
  recommendedRoute: string;
  urgentActions: string[];
  completenessScore: number;
  nextSteps: string[];
  userSegment: 'beginner' | 'intermediate' | 'advanced' | 'power_user';
}

export const useIntelligentRouting = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<RoutingAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeRoutingNeeds = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Comprehensive user analysis
        const [profile, unifiedProfile, integrations, recentActivity] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single(),
            
          supabase
            .from('unified_business_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single(),
            
          supabase
            .from('integrations')
            .select('provider, is_active')
            .eq('user_id', user.id),
            
          supabase
            .from('user_engagement')
            .select('event_type, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)
        ]);

        const routingAnalysis = generateRoutingAnalysis({
          profile: profile.data,
          unifiedProfile: unifiedProfile.data,
          integrations: integrations.data || [],
          recentActivity: recentActivity.data || []
        });

        setAnalysis(routingAnalysis);
      } catch (error) {
        console.error('Error analyzing routing needs:', error);
        // Provide safe fallback
        setAnalysis({
          recommendedRoute: '/dashboard',
          urgentActions: [],
          completenessScore: 0,
          nextSteps: ['Complete your business profile'],
          userSegment: 'beginner'
        });
      } finally {
        setLoading(false);
      }
    };

    analyzeRoutingNeeds();
  }, [user]);

  return { analysis, loading };
};

const generateRoutingAnalysis = (data: any): RoutingAnalysis => {
  const { profile, unifiedProfile, integrations, recentActivity } = data;
  
  const completenessScore = unifiedProfile?.profile_completeness || 0;
  const chaosScore = profile?.chaos_score || 100;
  const hasIntegrations = integrations.length > 0;
  const setupPreference = profile?.setup_preference || 'minimal';
  
  // Determine user segment
  let userSegment: RoutingAnalysis['userSegment'] = 'beginner';
  if (completenessScore >= 80 && hasIntegrations) userSegment = 'power_user';
  else if (completenessScore >= 60) userSegment = 'advanced';
  else if (completenessScore >= 30) userSegment = 'intermediate';

  // Generate urgent actions
  const urgentActions: string[] = [];
  if (chaosScore > 80) urgentActions.push('Reduce business chaos with ClarityLens');
  if (completenessScore < 50) urgentActions.push('Complete your business profile');
  if (!hasIntegrations && setupPreference === 'connect') {
    urgentActions.push('Connect your business tools');
  }

  // Determine recommended route
  let recommendedRoute = '/dashboard';
  if (urgentActions.includes('Reduce business chaos')) recommendedRoute = '/clarity';
  else if (completenessScore < 40) recommendedRoute = '/onboarding';
  else if (userSegment === 'power_user') recommendedRoute = '/feed';
  else if (setupPreference === 'grow') recommendedRoute = '/recommendations';

  // Generate next steps
  const nextSteps = generateNextSteps(completenessScore, chaosScore, hasIntegrations, setupPreference);

  return {
    recommendedRoute,
    urgentActions,
    completenessScore,
    nextSteps,
    userSegment
  };
};

const generateNextSteps = (
  completeness: number, 
  chaos: number, 
  hasIntegrations: boolean, 
  preference: string
): string[] => {
  const steps: string[] = [];

  if (completeness < 30) {
    steps.push('Complete basic business information');
    steps.push('Take the business assessment quiz');
  } else if (completeness < 60) {
    steps.push('Add business goals and preferences');
    if (!hasIntegrations) steps.push('Connect your first business tool');
  } else if (completeness < 80) {
    steps.push('Optimize your integrations');
    steps.push('Set up AI preferences');
  } else {
    steps.push('Review advanced analytics');
    steps.push('Explore strategic recommendations');
  }

  if (chaos > 70) {
    steps.unshift('Use ClarityLens to organize priorities');
  }

  return steps.slice(0, 3);
};