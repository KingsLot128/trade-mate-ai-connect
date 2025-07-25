
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import CallsManager from '@/components/dashboard/CallsManager';
import ScheduleManager from '@/components/scheduling/ScheduleManager';
import CustomerManager from '@/components/crm/CustomerManager';
import RevenueTracker from '@/components/revenue/RevenueTracker';
import MissedCallRecovery from '@/components/recovery/MissedCallRecovery';
import AIInsights from '@/components/insights/AIInsights';
import SmartCallHandler from '@/components/ai/SmartCallHandler';
import SetupWizard from '@/components/onboarding/SetupWizard';
import SetupGuide from '@/components/SetupGuide';
import { Navigate, useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    const checkUserSetup = async () => {
      if (!user) return;

      try {
        // Check if user has completed setup
        const { data: profile } = await supabase
          .from('profiles')
          .select('business_name, industry, phone')
          .eq('id', user.id)
          .single();

        const { data: settings } = await supabase
          .from('business_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const hasCompletedSetup = profile?.business_name && profile?.industry && settings;
        
        if (!hasCompletedSetup) {
          setIsFirstTime(true);
          setShowSetupWizard(true);
        }
      } catch (error) {
        console.error('Error checking user setup:', error);
        // If there's an error, assume first time user
        setIsFirstTime(true);
        setShowSetupWizard(true);
      }
    };

    if (user && !loading) {
      checkUserSetup();
    }
  }, [user, loading]);

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSetupComplete = () => {
    setShowSetupWizard(false);
    setIsFirstTime(false);
    setActiveTab('overview');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Show setup wizard for first-time users or when explicitly requested
  if (showSetupWizard) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'setup':
        return <SetupGuide />;
      case 'calls':
        return <CallsManager />;
      case 'ai-assistant':
        return <SmartCallHandler />;
      case 'insights':
        return <AIInsights />;
      case 'recovery':
        return <MissedCallRecovery />;
      case 'revenue':
        return <RevenueTracker />;
      case 'customers':
        return <CustomerManager />;
      case 'appointments':
        return <ScheduleManager />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Settings</h3>
            <p className="text-gray-600 mb-4">Manage your account and business settings</p>
            <button 
              onClick={() => setShowSetupWizard(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Run Setup Wizard Again
            </button>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveTab()}
    </DashboardLayout>
  );
};

export default Dashboard;
