import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface NewUserAuthGuardProps {
  children: React.ReactNode;
}

const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
);

export const NewUserAuthGuard = ({ children }: NewUserAuthGuardProps) => {
  const { user, loading, isProfileComplete, isNewUser } = useAuth();
  const location = useLocation();

  console.log('🛡️ NewUserAuthGuard check:', {
    user: user?.email,
    loading,
    isProfileComplete,
    isNewUser,
    path: location.pathname
  });

  // Show loading while checking auth
  if (loading) {
    return <LoadingSpinner message="Loading your account..." />;
  }

  // Not authenticated - redirect to auth
  if (!user) {
    console.log('🔄 Redirecting to auth - no user');
    return <Navigate to="/auth" replace />;
  }

  // Handle onboarding page
  if (location.pathname === '/onboarding') {
    // If user is not new and profile is complete, redirect to dashboard
    if (!isNewUser && isProfileComplete) {
      console.log('🔄 Redirecting to dashboard - returning user with complete profile');
      return <Navigate to="/dashboard" replace />;
    }
    // Otherwise allow access to onboarding
    return <>{children}</>;
  }

  // Handle other protected pages
  // New users with incomplete profiles should go to onboarding
  if (isNewUser && !isProfileComplete) {
    console.log('🔄 Redirecting to onboarding - new user needs setup');
    return <Navigate to="/onboarding" replace />;
  }

  // Returning users with incomplete profiles should also complete onboarding
  if (!isNewUser && !isProfileComplete) {
    console.log('🔄 Redirecting to onboarding - returning user with incomplete profile');
    return <Navigate to="/onboarding" replace />;
  }

  // All good - render children
  return <>{children}</>;
};
