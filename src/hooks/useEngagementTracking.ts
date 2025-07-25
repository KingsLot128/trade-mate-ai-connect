import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface EngagementMetadata {
  rating?: number;
  timeSpent?: number;
  scrollDepth?: number;
  outcomeReported?: string;
  businessImpact?: any;
  viewport?: { width: number; height: number };
  userAgent?: string;
  timestamp?: Date;
}

export const useEngagementTracking = () => {
  const { user } = useAuth();

  const trackEngagement = useCallback(async (
    recommendationId: string,
    action: string,
    metadata: EngagementMetadata = {}
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recommendation_interactions')
        .insert({
          user_id: user.id,
          recommendation_id: recommendationId,
          interaction_type: action,
          time_spent: metadata.timeSpent || 0,
          scroll_depth: metadata.scrollDepth || 0,
          feedback_rating: metadata.rating || null,
          outcome_reported: metadata.outcomeReported || null,
          business_impact: metadata.businessImpact || {},
          metadata: {
            viewport: metadata.viewport || { width: window.innerWidth, height: window.innerHeight },
            userAgent: metadata.userAgent || navigator.userAgent,
            timestamp: (metadata.timestamp || new Date()).toISOString()
          }
        });

      if (error) {
        console.error('Error tracking engagement:', error);
      }
    } catch (error) {
      console.error('Engagement tracking failed:', error);
    }
  }, [user]);

  const trackOutcome = useCallback(async (
    recommendationId: string,
    outcome: string,
    impact: any
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recommendation_interactions')
        .insert({
          user_id: user.id,
          recommendation_id: recommendationId,
          interaction_type: 'outcome_reported',
          outcome_reported: outcome,
          business_impact: impact,
          metadata: {
            timestamp: new Date().toISOString()
          }
        });

      if (error) {
        console.error('Error tracking outcome:', error);
      }
    } catch (error) {
      console.error('Outcome tracking failed:', error);
    }
  }, [user]);

  const trackTimeSpent = useCallback(async (
    recommendationId: string,
    timeSpent: number
  ) => {
    await trackEngagement(recommendationId, 'time_spent', { timeSpent });
  }, [trackEngagement]);

  const trackScrollDepth = useCallback(async (
    recommendationId: string,
    scrollDepth: number
  ) => {
    await trackEngagement(recommendationId, 'scroll_depth', { scrollDepth });
  }, [trackEngagement]);

  return { 
    trackEngagement, 
    trackOutcome, 
    trackTimeSpent, 
    trackScrollDepth 
  };
};