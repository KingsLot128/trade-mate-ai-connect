import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface OnboardingData {
  businessName: string;
  industry: string;
  phone: string;
  businessSize?: string;
  yearsInBusiness?: number;
  location?: string;
  primaryGoal?: string;
  biggestChallenge?: string;
  targetRevenue?: string;
  quizResponses?: any;
  chaosScore: number;
  clarityZone?: string;
  primaryServices?: string[];
  businessGoals?: string;
  targetCustomers?: string;
  competitionLevel?: string;
  pricingStrategy?: string;
}

export class OnboardingManager {
  private static instance: OnboardingManager;

  static getInstance(): OnboardingManager {
    if (!OnboardingManager.instance) {
      OnboardingManager.instance = new OnboardingManager();
    }
    return OnboardingManager.instance;
  }

  async saveOnboardingData(user: User, data: OnboardingData): Promise<boolean> {
    console.log('🚀 Starting onboarding data save for user:', user.email);
    
    try {
      // Save all data in sequence with proper error handling
      await this.saveUserProfile(user, data);
      await this.saveBusinessSettings(user, data);
      await this.saveQuizResponses(user, data);
      await this.initializeUnifiedProfile(user, data);

      // Verify data was saved
      const verification = await this.verifyOnboardingCompletion(user.id);
      if (!verification.isComplete) {
        console.error('❌ Onboarding verification failed:', verification);
        throw new Error(`Onboarding verification failed: ${verification.reason}`);
      }

      console.log('✅ Onboarding data saved and verified successfully');
      return true;

    } catch (error) {
      console.error('❌ Onboarding save failed:', error);
      
      // Log detailed error for debugging
      await this.logOnboardingError(user.id, error, data);
      
      return false;
    }
  }

  private async saveUserProfile(user: User, data: OnboardingData): Promise<void> {
    console.log('💾 Saving user profile...');
    
    // Use upsert to handle both insert and update cases
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        business_name: data.businessName,
        industry: data.industry,
        phone: data.phone,
        business_size: data.businessSize || 'Small',
        years_in_business: data.yearsInBusiness || 1,
        location: data.location || '',
        primary_goal: data.primaryGoal || '',
        biggest_challenge: data.biggestChallenge || '',
        target_revenue: data.targetRevenue || '',
        primary_service_types: data.primaryServices || [data.industry],
        business_goals: data.businessGoals || '',
        target_customer_type: data.targetCustomers || 'Homeowners',
        competition_level: data.competitionLevel || 'medium',
        pricing_strategy: data.pricingStrategy || 'competitive',
        onboarding_step: 'completed',
        quiz_completed_at: new Date().toISOString(),
        setup_preference: 'minimal',
        chaos_score: data.chaosScore,
        business_health_score: Math.max(100 - data.chaosScore, 0),
        business_level: this.calculateBusinessLevel(data.chaosScore),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ User profile save failed:', error);
      throw new Error(`User profile save failed: ${error.message}`);
    }
    
    console.log('✅ User profile saved successfully');
  }

  private async saveBusinessSettings(user: User, data: OnboardingData): Promise<void> {
    console.log('💾 Saving business settings...');
    
    const { error } = await supabase
      .from('business_settings')
      .upsert({
        user_id: user.id,
        company_name: data.businessName,
        email: user.email,
        phone: data.phone,
        address: data.location || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Business settings save failed:', error);
      throw new Error(`Business settings save failed: ${error.message}`);
    }
    
    console.log('✅ Business settings saved successfully');
  }

  private async saveQuizResponses(user: User, data: OnboardingData): Promise<void> {
    console.log('💾 Saving quiz responses...');
    
    const { error } = await supabase
      .from('user_quiz_responses')
      .upsert({
        user_id: user.id,
        question_id: 'onboarding_completion',
        response: {
          businessName: data.businessName,
          industry: data.industry,
          chaosScore: data.chaosScore,
          completedAt: new Date().toISOString()
        },
        chaos_contribution: data.chaosScore,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Quiz responses save failed:', error);
      throw new Error(`Quiz responses save failed: ${error.message}`);
    }
    
    console.log('✅ Quiz responses saved successfully');
  }

  private async initializeUnifiedProfile(user: User, data: OnboardingData): Promise<void> {
    console.log('💾 Initializing unified profile...');
    
    const { error } = await supabase
      .from('unified_business_profiles')
      .upsert({
        user_id: user.id,
        profile_data: {
          businessName: data.businessName,
          industry: data.industry,
          businessSize: data.businessSize || 'Small',
          location: data.location || '',
          goals: data.primaryGoal || '',
          challenges: data.biggestChallenge || ''
        },
        profile_completeness: 85, // High completeness after onboarding
        intelligence_score: Math.max(100 - data.chaosScore, 0),
        last_updated: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Unified profile initialization failed:', error);
      throw new Error(`Unified profile initialization failed: ${error.message}`);
    }
    
    console.log('✅ Unified profile initialized successfully');
  }

  async verifyOnboardingCompletion(userId: string): Promise<{isComplete: boolean, reason?: string}> {
    console.log('🔍 Verifying onboarding completion for user:', userId);
    
    try {
      // Check if profile exists and has required data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('business_name, industry, phone, onboarding_step, quiz_completed_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Profile query error:', profileError);
        return { isComplete: false, reason: 'Profile query failed' };
      }

      if (!profile) {
        return { isComplete: false, reason: 'No user profile found' };
      }

      // Check if onboarding is marked as completed
      if (profile.onboarding_step === 'completed') {
        console.log('✅ Onboarding verification successful - marked as completed');
        return { isComplete: true };
      }

      // Check if all required fields are present
      if (profile.business_name && profile.industry && profile.phone && profile.quiz_completed_at) {
        console.log('✅ Onboarding verification successful - all fields present');
        return { isComplete: true };
      }

      return { isComplete: false, reason: 'Incomplete profile data' };

    } catch (error) {
      console.error('❌ Onboarding verification failed:', error);
      return { isComplete: false, reason: `Verification error: ${error.message}` };
    }
  }

  private async logOnboardingError(userId: string, error: any, data: OnboardingData): Promise<void> {
    try {
      await supabase
        .from('user_engagement')
        .insert({
          user_id: userId,
          event_type: 'onboarding_error',
          event_data: {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
          }
        });
    } catch (logError) {
      console.error('Failed to log onboarding error:', logError);
    }
  }

  private calculateBusinessLevel(chaosScore: number): number {
    if (chaosScore <= 20) return 5; // Expert
    if (chaosScore <= 40) return 4; // Advanced
    if (chaosScore <= 60) return 3; // Intermediate
    if (chaosScore <= 80) return 2; // Beginner
    return 1; // Overwhelmed
  }

  // Public method to check completion status
  async checkOnboardingStatus(userId: string): Promise<boolean> {
    const verification = await this.verifyOnboardingCompletion(userId);
    return verification.isComplete;
  }
}

export const onboardingManager = OnboardingManager.getInstance();