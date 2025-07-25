import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface EnhancedAuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireComplete?: boolean;
  adminOnly?: boolean;
}

interface UserProfile {
  profile_completeness: number;
  onboarding_step: string;
  setup_preference: string;
}

export const EnhancedAuthGuard = ({ 
  children, 
  requireAuth = true, 
  requireComplete = false,
  adminOnly = false 
}: EnhancedAuthGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check admin status
        if (adminOnly) {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single();
          setIsAdmin(!!roles);
        }

        // Get unified profile data
        const { data: unifiedProfile } = await supabase
          .from('unified_business_profiles')
          .select('profile_completeness')
          .eq('user_id', user.id)
          .single();

        // Get basic profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_step, setup_preference')
          .eq('user_id', user.id)
          .single();

        setProfileData({
          profile_completeness: unifiedProfile?.profile_completeness || 0,
          onboarding_step: profile?.onboarding_step || 'not_started',
          setup_preference: profile?.setup_preference || 'minimal'
        });
      } catch (error) {
        console.error('Error checking user status:', error);
        setProfileData({
          profile_completeness: 0,
          onboarding_step: 'not_started',
          setup_preference: 'minimal'
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkUserStatus();
    }
  }, [user, authLoading, adminOnly]);

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Handle unauthenticated users
  if (!user && requireAuth) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Handle admin-only routes
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle authenticated users who shouldn't be on auth pages
  if (user && location.pathname === '/auth') {
    const redirectPath = determineOptimalRoute(profileData);
    return <Navigate to={redirectPath} replace />;
  }

  // Handle profile completeness requirements
  if (user && requireComplete && profileData) {
    const completeness = profileData.profile_completeness;
    const onboardingStep = profileData.onboarding_step;

    // If profile is incomplete, redirect to appropriate onboarding step
    if (completeness < 60 || onboardingStep === 'not_started') {
      if (location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
      }
    }
  }

  return <>{children}</>;
};

// Intelligent routing logic
const determineOptimalRoute = (profileData: UserProfile | null): string => {
  if (!profileData) return '/onboarding';

  const { profile_completeness, onboarding_step, setup_preference } = profileData;

  // New users or incomplete profiles go to onboarding
  if (profile_completeness < 60 || onboarding_step === 'not_started') {
    return '/onboarding';
  }

  // Users with moderate completion go to dashboard
  if (profile_completeness < 80) {
    return '/dashboard';
  }

  // Power users with high completion get advanced features
  if (setup_preference === 'connect' && profile_completeness >= 80) {
    return '/feed'; // Multi-stream feed for advanced users
  }

  // Default to dashboard
  return '/dashboard';
};