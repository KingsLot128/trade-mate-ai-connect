import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import RecommendationCard from './RecommendationCard';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';

interface Recommendation {
  id: string;
  recommendation_id: string;
  content: any;
  recommendation_type: string;
  stream_type: string;
  hook: string;
  estimated_read_time: number;
  expected_impact: string;
  time_to_implement: string;
  reasoning: string;
  priority_score: number;
  personalized_score: number;
  confidence_score: number;
  created_at: string;
}

const BusinessIntelligenceFeed = () => {
  const { user, isProfileComplete } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeStream, setActiveStream] = useState('forYou');
  const [loading, setLoading] = useState(true);
  const { trackEngagement } = useEngagementTracking();

  const streamTabs = [
    { id: 'forYou', label: 'For You', icon: '🎯' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'quickWins', label: 'Quick Wins', icon: '⚡' },
    { id: 'strategic', label: 'Strategic', icon: '💡' }
  ];

  useEffect(() => {
    if (user && isProfileComplete) {
      loadRecommendations();
    }
  }, [user, isProfileComplete, activeStream]);

  const loadRecommendations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load existing recommendations or generate sample ones
      const { data: existingRecs, error } = await supabase
        .from('enhanced_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('stream_type', activeStream)
        .eq('is_active', true)
        .order('priority_score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading recommendations:', error);
        return;
      }

      if (existingRecs && existingRecs.length > 0) {
        setRecommendations(existingRecs);
      } else {
        // Generate sample recommendations if none exist
        await generateSampleRecommendations();
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleRecommendations = async () => {
    if (!user) return;

    const sampleRecommendations = [
      {
        recommendation_id: `rec_${Date.now()}_1`,
        hook: "🚀 This one change could double your response rate",
        content: {
          title: "Implement SMS Follow-ups for Missed Calls",
          description: "Automatically send personalized SMS messages to missed calls within 2 minutes. Studies show 90% of SMS are read within 3 minutes."
        },
        recommendation_type: "quick_win",
        stream_type: activeStream,
        priority_score: 85,
        personalized_score: 90,
        confidence_score: 95,
        estimated_read_time: 3,
        expected_impact: "+40% callback rate",
        time_to_implement: "15 minutes",
        reasoning: "Your chaos score shows 78% of leads are lost after missed calls. SMS automation can recover 40% of these instantly.",
        is_active: true
      },
      {
        recommendation_id: `rec_${Date.now()}_2`,
        hook: "💡 Your competitors don't know this pricing strategy",
        content: {
          title: "Dynamic Pricing Based on Lead Quality",
          description: "Adjust your prices based on lead urgency, project scope, and decision-maker type. Premium pricing for high-quality leads."
        },
        recommendation_type: "strategic",
        stream_type: activeStream,
        priority_score: 75,
        personalized_score: 85,
        confidence_score: 80,
        estimated_read_time: 5,
        expected_impact: "+25% profit margin",
        time_to_implement: "2-3 hours",
        reasoning: "Your industry data shows 60% margin improvement when using value-based pricing for qualified leads.",
        is_active: true
      },
      {
        recommendation_id: `rec_${Date.now()}_3`,
        hook: "⚡ Fix this and book 3x more appointments",
        content: {
          title: "Optimize Your Peak Response Hours",
          description: "Call leads back within 5 minutes during 10am-2pm and 6pm-8pm. These are your highest conversion windows."
        },
        recommendation_type: "quick_win",
        stream_type: activeStream,
        priority_score: 90,
        personalized_score: 95,
        confidence_score: 90,
        estimated_read_time: 2,
        expected_impact: "+200% booking rate",
        time_to_implement: "Immediate",
        reasoning: "Your call data shows 3x higher conversion rates during these specific time windows.",
        is_active: true
      }
    ];

    try {
      const { error } = await supabase
        .from('enhanced_recommendations')
        .insert(
          sampleRecommendations.map(rec => ({
            ...rec,
            user_id: user.id
          }))
        );

      if (error) {
        console.error('Error creating sample recommendations:', error);
      } else {
        setRecommendations(sampleRecommendations as any);
      }
    } catch (error) {
      console.error('Failed to generate sample recommendations:', error);
    }
  };

  const handleEngagement = async (recommendationId: string, action: string, metadata?: any) => {
    await trackEngagement(recommendationId, action, metadata);
  };

  const handleAction = async (recommendationId: string, action: string) => {
    await trackEngagement(recommendationId, action);
    
    if (action === 'dismiss') {
      // Remove from current feed
      setRecommendations(prev => 
        prev.filter(rec => rec.recommendation_id !== recommendationId)
      );
      
      // Mark as inactive in database
      await supabase
        .from('enhanced_recommendations')
        .update({ is_active: false })
        .eq('recommendation_id', recommendationId);
    }
  };

  if (!isProfileComplete) {
    return (
      <div className="text-center py-12">
        <div className="text-lg font-semibold mb-2">Complete Your Assessment First</div>
        <div className="text-muted-foreground">
          Take the business clarity quiz to get personalized recommendations
        </div>
      </div>
    );
  }

  return (
    <div className="business-intelligence-feed">
      {/* Stream selector */}
      <div className="stream-selector flex space-x-1 mb-6 bg-muted/50 rounded-lg p-1">
        {streamTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveStream(tab.id)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeStream === tab.id 
                ? 'bg-background shadow-sm text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations feed */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading personalized recommendations...</div>
        </div>
      ) : (
        <div className="recommendations-feed space-y-6">
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-lg font-semibold mb-2">No recommendations yet</div>
              <div className="text-muted-foreground">
                Check back soon for personalized business insights
              </div>
            </div>
          ) : (
            recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.recommendation_id}
                recommendation={recommendation}
                streamType={activeStream}
                onEngagement={handleEngagement}
                onAction={handleAction}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessIntelligenceFeed;