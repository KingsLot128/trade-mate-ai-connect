import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

const Auth = () => {
  const { user, loading, isNewUser, isProfileComplete } = useAuth();

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

  // If user is already logged in, determine where to redirect them
  if (user) {
    // New users or users with incomplete profiles go to onboarding
    if (isNewUser || !isProfileComplete) {
      return <Navigate to="/onboarding" replace />;
    }
    // Existing users with complete profiles go to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginForm />;
};

export default Auth;
