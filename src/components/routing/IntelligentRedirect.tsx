import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface RedirectState {
  profileCompleteness: number;
  onboardingStep: string;
  setupPreference: string;
  hasIntegrations: boolean;
  chaosScore: number;
}

export const IntelligentRedirect = () => {
  const { user } = useAuth();
  const [redirectState, setRedirectState] = React.useState<RedirectState | null>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const analyzeUserState = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get comprehensive user data in parallel
        const [unifiedProfile, profile, integrations] = await Promise.all([
          supabase
            .from('unified_business_profiles')
            .select('profile_completeness')
            .eq('user_id', user.id)
            .single(),
          
          supabase
            .from('profiles')
            .select('onboarding_step, setup_preference, chaos_score')
            .eq('user_id', user.id)
            .single(),
            
          supabase
            .from('integrations')
            .select('id')
            .eq('user_id', user.id)
            .eq('is_active', true)
        ]);

        setRedirectState({
          profileCompleteness: unifiedProfile.data?.profile_completeness || 0,
          onboardingStep: profile.data?.onboarding_step || 'not_started',
          setupPreference: profile.data?.setup_preference || 'minimal',
          hasIntegrations: (integrations.data?.length || 0) > 0,
          chaosScore: profile.data?.chaos_score || 100
        });
      } catch (error) {
        console.error('Error analyzing user state:', error);
        // Default safe state
        setRedirectState({
          profileCompleteness: 0,
          onboardingStep: 'not_started',
          setupPreference: 'minimal',
          hasIntegrations: false,
          chaosScore: 100
        });
      } finally {
        setLoading(false);
      }
    };

    analyzeUserState();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing your business profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !redirectState) {
    return <Navigate to="/auth" replace />;
  }

  const optimalRoute = determineOptimalRoute(redirectState);
  return <Navigate to={optimalRoute} replace />;
};

const determineOptimalRoute = (state: RedirectState): string => {
  const { profileCompleteness, onboardingStep, setupPreference, hasIntegrations, chaosScore } = state;

  // Priority 1: Incomplete onboarding
  if (profileCompleteness < 40 || onboardingStep === 'not_started') {
    return '/onboarding';
  }

  // Priority 2: High chaos score needs immediate attention
  if (chaosScore > 80 && profileCompleteness < 70) {
    return '/clarity'; // ClarityLens for chaos management
  }

  // Priority 3: Advanced users with integrations
  if (setupPreference === 'connect' && hasIntegrations && profileCompleteness >= 70) {
    return '/feed'; // Multi-stream intelligence feed
  }

  // Priority 4: Growth-focused users
  if (setupPreference === 'grow' && profileCompleteness >= 60) {
    return '/recommendations'; // AI insights and recommendations
  }

  // Priority 5: Users ready for business health monitoring
  if (profileCompleteness >= 50) {
    return '/health'; // Business health dashboard
  }

  // Default: Standard dashboard
  return '/dashboard';
};