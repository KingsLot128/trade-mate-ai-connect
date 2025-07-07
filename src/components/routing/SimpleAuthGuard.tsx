import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface SimpleAuthGuardProps {
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

export const SimpleAuthGuard = ({ children }: SimpleAuthGuardProps) => {
  const { user, loading, isProfileComplete } = useAuth();
  const location = useLocation();

  console.log('🛡️ AuthGuard check:', {
    user: user?.email,
    loading,
    isProfileComplete,
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

  // On onboarding page
  if (location.pathname === '/onboarding') {
    // If profile is complete, redirect to dashboard
    if (isProfileComplete) {
      console.log('🔄 Redirecting to dashboard - profile complete');
      return <Navigate to="/dashboard" replace />;
    }
    // Otherwise, stay on onboarding
    return <>{children}</>;
  }

  // On other pages
  if (!isProfileComplete) {
    console.log('🔄 Redirecting to onboarding - profile incomplete');
    return <Navigate to="/onboarding" replace />;
  }

  // All good - render children
  return <>{children}</>;
};
