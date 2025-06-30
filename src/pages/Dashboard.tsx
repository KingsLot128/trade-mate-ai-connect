
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
import CallsLog from '@/components/calls/CallsLog';
import ContactsList from '@/components/crm/ContactsList';
import DealsPipeline from '@/components/deals/DealsPipeline';
import ProposalManager from '@/components/proposals/ProposalManager';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');

  useEffect(() => {
    const checkUserSetup = async () => {
      if (!user) return;

      try {
        // Check if user has completed setup
        const { data: profile } = await supabase
          .from('profiles')
          .select('business_name, industry, phone, full_name')
          .eq('user_id', user.id)
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

        // Check user role (in production, this would come from JWT or user metadata)
        const isAdmin = user.email === 'ajose002@gmail.com'; // Demo admin check
        setUserRole(isAdmin ? 'admin' : 'user');
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

  // Show setup wizard for first-time users or when explicitly requested
  if (showSetupWizard) {
    return (
      <ProtectedRoute>
        <SetupWizard onComplete={handleSetupComplete} />
      </ProtectedRoute>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'setup':
        return <SetupGuide />;
      case 'calls':
        return <CallsLog />;
      case 'contacts': 
        return <ContactsList />;
      case 'deals':
        return <DealsPipeline />;
      case 'proposals':
        return <ProposalManager />;
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
      case 'admin-users':
        return userRole === 'admin' ? <AdminUserManagement /> : <DashboardOverview />;
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
    <ProtectedRoute>
      <DashboardLayout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        userRole={userRole}
      >
        {renderActiveTab()}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;
