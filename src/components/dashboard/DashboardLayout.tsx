
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Phone,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  PhoneMissed,
  Brain,
  FileText,
  DollarSign,
  BarChart3,
  UserCog,
  Shield
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange,
  userRole = 'user'
}) => {
  const { signOut } = useAuth();

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'clarity-lens', label: 'Clarity Lens', icon: Brain },
    { id: 'decisions', label: 'Decision Feed', icon: Brain },
    { id: 'calls', label: 'Call Log', icon: Phone },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'deals', label: 'Deals Pipeline', icon: TrendingUp },
    { id: 'proposals', label: 'AI Proposals', icon: FileText },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'calendar', label: 'Calendar Hub', icon: Calendar },
    { id: 'recovery', label: 'Missed Calls', icon: PhoneMissed },
    { id: 'insights', label: 'AI Insights', icon: BarChart3 },
    { id: 'integrations', label: 'Integrations', icon: Settings },
  ];

  const adminItems = [
    { id: 'admin-users', label: 'User Management', icon: UserCog },
  ];

  const settingsItems = [
    { id: 'setup', label: 'Setup Guide', icon: Settings },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            TradeMate AI
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI Assistant Dashboard</p>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <nav className="p-4 space-y-1">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      activeTab === item.id && "bg-gradient-to-r from-blue-600 to-green-600"
                    )}
                    onClick={() => onTabChange(item.id)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {/* Admin Section */}
            {userRole === 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  <div className="flex items-center px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <Shield className="mr-2 h-3 w-3" />
                    Admin
                  </div>
                </div>
                <div className="space-y-1">
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          activeTab === item.id && "bg-gradient-to-r from-blue-600 to-green-600"
                        )}
                        onClick={() => onTabChange(item.id)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Settings Section */}
            <div className="pt-4 pb-2">
              <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </div>
            </div>
            <div className="space-y-1">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      activeTab === item.id && "bg-gradient-to-r from-blue-600 to-green-600"
                    )}
                    onClick={() => onTabChange(item.id)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>
        </ScrollArea>

        {/* Sign Out Button */}
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
