import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireComplete?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true, 
  requireComplete = false 
}) => {
  const { user, loading, isProfileComplete } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated
  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // BYPASS FOR TEST USER - ALWAYS ALLOW ACCESS
  if (user?.email === 'ajose002@gmail.com') {
    console.log('AuthGuard: Bypassing all checks for test user');
    return <>{children}</>;
  }

  // If user is authenticated but trying to access auth page
  if (!requireAuth && user) {
    // If profile is complete, go to dashboard
    if (isProfileComplete) {
      return <Navigate to="/dashboard" replace />;
    }
    // If profile is incomplete, go to onboarding
    return <Navigate to="/onboarding" replace />;
  }

  // If complete profile is required but user hasn't completed it
  if (requireComplete && user && !isProfileComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  // If user has completed profile but trying to access onboarding
  if (location.pathname === '/onboarding' && user && isProfileComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;