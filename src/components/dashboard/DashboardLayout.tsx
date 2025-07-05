
import React, { useState } from 'react';
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
  Shield,
  Menu,
  X,
  User
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'business-health', label: 'Business Health', icon: Brain, badge: 'NEW', badgeColor: 'bg-green-500' },
    { id: 'intelligence-feed', label: 'Intelligence Feed', icon: Brain, badge: 'AI', badgeColor: 'bg-purple-500' },
    { id: 'clarity-lens', label: 'Clarity Lens', icon: Brain },
    { id: 'decisions', label: 'Decision Feed', icon: Brain },
    { id: 'calls', label: 'Call Log', icon: Phone },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'deals', label: 'Deals Pipeline', icon: TrendingUp },
    { id: 'proposals', label: 'AI Proposals', icon: FileText },
    { id: 'builtin-tools', label: 'Smart Tools', icon: Settings, badge: 'SMART', badgeColor: 'bg-blue-500' },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'calendar', label: 'Calendar Hub', icon: Calendar },
    { id: 'recovery', label: 'Missed Calls', icon: PhoneMissed },
    { id: 'insights', label: 'AI Insights', icon: BarChart3 },
    { id: 'integration-hub', label: 'Integration Hub', icon: Settings, badge: 'HUB', badgeColor: 'bg-indigo-500' },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: Shield },
    { id: 'admin-users', label: 'User Management', icon: UserCog },
  ];

  const userItems = [
    { id: 'profile', label: 'My Profile', icon: User },
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
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/90 backdrop-blur-sm"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-white shadow-sm border-r transition-transform duration-300 ease-in-out z-40",
        "w-64 lg:w-64 lg:relative lg:translate-x-0",
        "fixed lg:static h-full",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
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
                      "w-full justify-start relative",
                      activeTab === item.id && "bg-gradient-to-r from-blue-600 to-green-600"
                    )}
                    onClick={() => {
                      onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                    {item.badge && (
                      <span className={cn(
                        "absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full text-white font-bold",
                        item.badgeColor
                      )}>
                        {item.badge}
                      </span>
                    )}
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
                        onClick={() => {
                          onTabChange(item.id);
                          setSidebarOpen(false);
                        }}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </>
            )}

            {/* User Profile Section - Only for regular users */}
            {userRole !== 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  <div className="flex items-center px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <User className="mr-2 h-3 w-3" />
                    Profile
                  </div>
                </div>
                <div className="space-y-1">
                  {userItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          activeTab === item.id && "bg-gradient-to-r from-blue-600 to-green-600"
                        )}
                        onClick={() => {
                          onTabChange(item.id);
                          setSidebarOpen(false);
                        }}
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
                    onClick={() => {
                      onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
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
        <main className="p-3 lg:p-6 pt-16 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
