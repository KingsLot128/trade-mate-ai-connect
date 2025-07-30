import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  chaos_score: number | null;
  setup_preference: string | null;
  industry: string | null;
  business_name: string | null;
  onboarding_step: string | null;
  quiz_completed_at: string | null;
  clarity_zone: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  has_completed_tour: boolean | null;
  instructor_id: string | null;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          chaos_score,
          setup_preference,
          industry,
          business_name,
          onboarding_step,
          quiz_completed_at,
          clarity_zone,
          full_name,
          email,
          phone,
          has_completed_tour,
          instructor_id
        `)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, this is normal for new users
          setProfile(null);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Refresh profile data
      await fetchProfile();
      
      // Trigger universal intelligence updates
      await triggerIntelligenceUpdate();
      
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    }
  };

  const triggerIntelligenceUpdate = async () => {
    if (!user) return;
    
    try {
      // Trigger AI analysis update
      await supabase.functions.invoke('ai-business-advisor', {
        body: {
          analysisType: 'profile_update',
          userId: user.id,
          trigger: 'profile_change'
        }
      });
    } catch (error) {
      console.error('Error triggering intelligence update:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const isNewUser = () => {
    return !profile || !profile.quiz_completed_at;
  };

  const hasCompletedOnboarding = () => {
    return profile?.onboarding_step === 'completed';
  };

  const getChaosLevel = () => {
    if (!profile?.chaos_score) return 'unknown';
    if (profile.chaos_score >= 70) return 'high';
    if (profile.chaos_score >= 40) return 'medium';
    return 'low';
  };

  const getSetupRecommendation = () => {
    const chaosLevel = getChaosLevel();
    
    switch (chaosLevel) {
      case 'high':
        return 'minimal';
      case 'low':
        return 'connect';
      default:
        return 'builtin';
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    isNewUser,
    hasCompletedOnboarding,
    getChaosLevel,
    getSetupRecommendation
  };
};