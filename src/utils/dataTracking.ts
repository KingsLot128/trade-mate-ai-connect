import { supabase } from '@/lib/supabase';
import { synthesizeBusinessData } from './dataUnification';
import { generateAdaptiveRecommendations, getUserBehavior, getIndustryBenchmarks } from './adaptiveRecommendations';

interface UserAction {
  action_type: string;
  context: Record<string, any>;
  outcome?: string;
  business_impact?: number;
  timestamp: string;
}

interface IntegrationEvent {
  provider: string;
  event_type: 'connect' | 'sync' | 'error' | 'disconnect';
  data_quality: number;
  records_processed?: number;
  error_details?: string;
}

interface BusinessOutcome {
  metric_type: string;
  before_value: number;
  after_value: number;
  change_percentage: number;
  attribution_sources: string[];
  confidence_level: number;
}

export class DataTracker {
  private userId: string;
  private sessionId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track all user actions for learning
  async trackUserAction(actionType: string, context: Record<string, any>, outcome?: string): Promise<void> {
    try {
      const action: UserAction = {
        action_type: actionType,
        context: {
          ...context,
          session_id: this.sessionId,
          user_agent: navigator.userAgent,
          page_url: window.location.href,
          timestamp: new Date().toISOString()
        },
        outcome,
        timestamp: new Date().toISOString()
      };

      // Store in automation_events for processing
      await supabase
        .from('automation_events')
        .insert({
          user_id: this.userId,
          event_type: 'user_action',
          event_data: action,
          processed: false
        });

      // Immediately analyze for business intelligence
      await this.analyzeActionForBI(action);

    } catch (error) {
      console.error('Error tracking user action:', error);
    }
  }

  // Track integration usage and data quality
  async trackIntegrationEvent(event: IntegrationEvent): Promise<void> {
    try {
      const enhancedEvent = {
        ...event,
        user_id: this.userId,
        session_id: this.sessionId,
        timestamp: new Date().toISOString()
      };

      await supabase
        .from('automation_events')
        .insert({
          user_id: this.userId,
          event_type: 'integration_event',
          event_data: enhancedEvent,
          processed: false
        });

      // Update user's integration effectiveness score
      await this.updateIntegrationEffectiveness(event.provider, event.data_quality);

    } catch (error) {
      console.error('Error tracking integration event:', error);
    }
  }

  // Track business outcomes and attribute to recommendations
  async trackBusinessOutcome(outcome: BusinessOutcome): Promise<void> {
    try {
      // Store the outcome
      await supabase
        .from('business_metrics')
        .insert({
          user_id: this.userId,
          metric_type: `outcome_${outcome.metric_type}`,
          value: outcome.after_value,
          context: {
            before_value: outcome.before_value,
            change_percentage: outcome.change_percentage,
            attribution_sources: outcome.attribution_sources,
            confidence_level: outcome.confidence_level,
            tracked_at: new Date().toISOString()
          }
        });

      // Update recommendation effectiveness scores
      await this.updateRecommendationEffectiveness(outcome);

      // Trigger adaptive learning
      await this.triggerAdaptiveLearning();

    } catch (error) {
      console.error('Error tracking business outcome:', error);
    }
  }

  // Analyze user action for immediate business intelligence
  private async analyzeActionForBI(action: UserAction): Promise<void> {
    try {
      // Get current user behavior profile
      const userBehavior = await getUserBehavior(this.userId);
      
      // Update behavior patterns
      userBehavior.engagementPatterns.push(action.action_type);
      
      // Calculate implementation rate if action was completing a recommendation
      if (action.action_type === 'recommendation_implemented') {
        const implementedCount = userBehavior.engagementPatterns.filter(p => p === 'recommendation_implemented').length;
        const totalRecommendations = userBehavior.engagementPatterns.filter(p => p.includes('recommendation')).length;
        userBehavior.implementationRate = implementedCount / Math.max(totalRecommendations, 1);
      }

      // Store interaction for learning
      await supabase
        .from('recommendation_interactions')
        .insert({
          user_id: this.userId,
          recommendation_id: action.context.recommendation_id || 'general_action',
          interaction_type: action.action_type,
          time_spent: action.context.time_spent || 0,
          scroll_depth: action.context.scroll_depth || 0,
          feedback_rating: action.context.rating,
          outcome_reported: action.outcome,
          business_impact: action.context.business_impact || {},
          metadata: {
            session_id: this.sessionId,
            context: action.context
          }
        });

    } catch (error) {
      console.error('Error analyzing action for BI:', error);
    }
  }

  // Update integration effectiveness based on usage
  private async updateIntegrationEffectiveness(provider: string, dataQuality: number): Promise<void> {
    try {
      // Get existing effectiveness score
      const { data: existing } = await supabase
        .from('business_metrics')
        .select('value, context')
        .eq('user_id', this.userId)
        .eq('metric_type', `integration_effectiveness_${provider}`)
        .single();

      let newScore = dataQuality;
      let eventCount = 1;

      if (existing) {
        const currentScore = existing.value;
        eventCount = (existing.context?.event_count || 0) + 1;
        // Rolling average with more weight on recent events
        newScore = (currentScore * 0.7) + (dataQuality * 0.3);
      }

      await supabase
        .from('business_metrics')
        .upsert({
          user_id: this.userId,
          metric_type: `integration_effectiveness_${provider}`,
          value: newScore,
          context: {
            event_count: eventCount,
            last_updated: new Date().toISOString(),
            data_quality_trend: dataQuality
          }
        }, { onConflict: 'user_id,metric_type' });

    } catch (error) {
      console.error('Error updating integration effectiveness:', error);
    }
  }

  // Update recommendation effectiveness based on outcomes
  private async updateRecommendationEffectiveness(outcome: BusinessOutcome): Promise<void> {
    try {
      for (const source of outcome.attribution_sources) {
        const effectivenessScore = Math.min(100, Math.abs(outcome.change_percentage) * outcome.confidence_level);
        
        await supabase
          .from('business_metrics')
          .upsert({
            user_id: this.userId,
            metric_type: `recommendation_effectiveness_${source}`,
            value: effectivenessScore,
            context: {
              outcome_type: outcome.metric_type,
              change_percentage: outcome.change_percentage,
              confidence_level: outcome.confidence_level,
              updated_at: new Date().toISOString()
            }
          }, { onConflict: 'user_id,metric_type' });
      }
    } catch (error) {
      console.error('Error updating recommendation effectiveness:', error);
    }
  }

  // Trigger adaptive learning to improve recommendations
  private async triggerAdaptiveLearning(): Promise<void> {
    try {
      // Get unified business profile
      const unifiedProfile = await synthesizeBusinessData(this.userId);
      
      // Get user behavior
      const userBehavior = await getUserBehavior(this.userId);
      
      // Get industry benchmarks
      const industryBenchmarks = getIndustryBenchmarks(unifiedProfile.businessInfo.industry);
      
      // Generate new adaptive recommendations
      await generateAdaptiveRecommendations(this.userId, {
        unifiedProfile,
        userBehavior,
        industryBenchmarks
      });

      console.log('Adaptive learning triggered successfully');
    } catch (error) {
      console.error('Error triggering adaptive learning:', error);
    }
  }
}

// Global tracking instance
let globalTracker: DataTracker | null = null;

export const initializeTracking = (userId: string): DataTracker => {
  globalTracker = new DataTracker(userId);
  return globalTracker;
};

export const getTracker = (): DataTracker | null => {
  return globalTracker;
};

// Convenience functions for common tracking scenarios
export const trackRecommendationView = async (recommendationId: string, context: any = {}) => {
  const tracker = getTracker();
  if (tracker) {
    await tracker.trackUserAction('recommendation_viewed', {
      recommendation_id: recommendationId,
      ...context
    });
  }
};

export const trackRecommendationImplemented = async (recommendationId: string, outcome: string, businessImpact?: number) => {
  const tracker = getTracker();
  if (tracker) {
    await tracker.trackUserAction('recommendation_implemented', {
      recommendation_id: recommendationId,
      business_impact: businessImpact
    }, outcome);
  }
};

export const trackSetupCompletion = async (setupData: any, chaosScore: number) => {
  const tracker = getTracker();
  if (tracker) {
    await tracker.trackUserAction('setup_completed', {
      setup_data: setupData,
      chaos_score: chaosScore,
      completion_time: new Date().toISOString()
    }, 'onboarding_complete');
  }
};

export const trackIntegrationConnected = async (provider: string, dataQuality: number = 100) => {
  const tracker = getTracker();
  if (tracker) {
    await tracker.trackIntegrationEvent({
      provider,
      event_type: 'connect',
      data_quality: dataQuality
    });
  }
};

export const trackBusinessMetricChange = async (
  metricType: string, 
  beforeValue: number, 
  afterValue: number, 
  attributionSources: string[] = ['general'],
  confidenceLevel: number = 0.8
) => {
  const tracker = getTracker();
  if (tracker) {
    const changePercentage = ((afterValue - beforeValue) / beforeValue) * 100;
    await tracker.trackBusinessOutcome({
      metric_type: metricType,
      before_value: beforeValue,
      after_value: afterValue,
      change_percentage: changePercentage,
      attribution_sources: attributionSources,
      confidence_level: confidenceLevel
    });
  }
};