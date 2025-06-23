
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import LoginForm from '@/components/auth/LoginForm';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import CallsManager from '@/components/dashboard/CallsManager';
import SetupGuide from '@/components/SetupGuide';
import SetupWizard from '@/components/onboarding/SetupWizard';
import SmartCallHandler from '@/components/ai/SmartCallHandler';
import MissedCallRecovery from '@/components/recovery/MissedCallRecovery';
import RevenueTracker from '@/components/revenue/RevenueTracker';
import CustomerManager from '@/components/crm/CustomerManager';
import InventoryManager from '@/components/inventory/InventoryManager';
import TeamManager from '@/components/team/TeamManager';
import ScheduleManager from '@/components/scheduling/ScheduleManager';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    checkUserSetup();
  }, [user]);

  const checkUserSetup = async () => {
    if (!user) {
      setCheckingSetup(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('business_name, industry')
        .eq('id', user.id)
        .single();

      if (!profile?.business_name || !profile?.industry) {
        setIsFirstTime(true);
      }
    } catch (error) {
      console.error('Error checking user setup:', error);
    } finally {
      setCheckingSetup(false);
    }
  };

  const handleSetupComplete = () => {
    setIsFirstTime(false);
    setActiveTab('overview');
  };

  if (loading || checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (isFirstTime) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'calls':
        return <CallsManager />;
      case 'setup':
        return <SetupGuide />;
      case 'ai-assistant':
        return <SmartCallHandler />;
      case 'recovery':
        return <MissedCallRecovery />;
      case 'revenue':
        return <RevenueTracker />;
      case 'customers':
        return <CustomerManager />;
      case 'appointments':
        return <ScheduleManager />;
      case 'inventory':
        return <InventoryManager />;
      case 'team':
        return <TeamManager />;
      case 'settings':
        return <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Business Settings</h3>
          <p className="text-gray-600">Customize your AI assistant and business preferences...</p>
        </div>;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
