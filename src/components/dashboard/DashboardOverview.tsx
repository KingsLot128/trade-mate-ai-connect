
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, Calendar, TrendingUp, PhoneMissed, PhoneCall } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import PWAInstall from '@/components/PWAInstall';
import DashboardChart from './DashboardChart';
import BusinessHealthWidget from './BusinessHealthWidget';
import AIInsightsPreview from '@/components/insights/AIInsightsPreview';
import { SubscriptionWidget } from './SubscriptionWidget';
import ProfileCompletionGuide from '@/components/profile/ProfileCompletionGuide';
import RecommendationBootstrap from '@/components/ai/RecommendationBootstrap';

interface DashboardStats {
  totalCalls: number;
  missedCalls: number;
  answeredCalls: number;
  totalCustomers: number;
  todayAppointments: number;
  conversionRate: number;
}

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCalls: 0,
    missedCalls: 0,
    answeredCalls: 0,
    totalCustomers: 0,
    todayAppointments: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  // Chart data
  const callsData = [
    { name: 'Mon', calls: 12, answered: 10 },
    { name: 'Tue', calls: 19, answered: 16 },
    { name: 'Wed', calls: 15, answered: 13 },
    { name: 'Thu', calls: 22, answered: 18 },
    { name: 'Fri', calls: 18, answered: 15 },
    { name: 'Sat', calls: 8, answered: 7 },
    { name: 'Sun', calls: 5, answered: 4 },
  ];

  const revenueData = [
    { name: 'Week 1', revenue: 2400 },
    { name: 'Week 2', revenue: 1398 },
    { name: 'Week 3', revenue: 9800 },
    { name: 'Week 4', revenue: 3908 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch calls data
        const { data: calls } = await supabase
          .from('calls')
          .select('status')
          .eq('user_id', user.id);

        const { data: customers } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id);

        const today = new Date().toISOString().split('T')[0];
        const { data: appointments } = await supabase
          .from('appointments')
          .select('id')
          .eq('user_id', user.id)
          .gte('scheduled_at', today + 'T00:00:00')
          .lt('scheduled_at', today + 'T23:59:59');

        const totalCalls = calls?.length || 0;
        const missedCalls = calls?.filter((call: any) => call.notes?.includes('missed')).length || 0;
        const answeredCalls = calls?.filter((call: any) => call.notes?.includes('answered')).length || 0;
        const conversionRate = totalCalls > 0 ? Math.round((answeredCalls / totalCalls) * 100) : 0;

        setStats({
          totalCalls,
          missedCalls,
          answeredCalls,
          totalCustomers: customers?.length || 0,
          todayAppointments: appointments?.length || 0,
          conversionRate,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      title: "Total Calls",
      value: stats.totalCalls,
      description: "All time calls",
      icon: Phone,
      trend: "+12% from last month"
    },
    {
      title: "Missed Calls",
      value: stats.missedCalls,
      description: "Calls needing follow-up",
      icon: PhoneMissed,
      trend: "-8% from last month"
    },
    {
      title: "Answered Calls",
      value: stats.answeredCalls,
      description: "Successfully handled",
      icon: PhoneCall,
      trend: "+15% from last month"
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      description: "Active customer base",
      icon: Users,
      trend: "+23% from last month"
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      description: "Scheduled for today",
      icon: Calendar,
      trend: "3 confirmed"
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      description: "Calls to appointments",
      icon: TrendingUp,
      trend: "+5% from last month"
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PWAInstall />
      
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your business performance and AI assistant activity.
        </p>
      </div>

      {/* Business Health and AI Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        <BusinessHealthWidget />
        <AIInsightsPreview />
        <SubscriptionWidget />
      </div>
      
      {/* Profile Completion and AI Bootstrap */}
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileCompletionGuide />
        <RecommendationBootstrap />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {card.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardChart
          title="Call Activity"
          description="Daily calls and answer rates"
          data={callsData}
          type="line"
          dataKey="calls"
          color="#3b82f6"
        />
        <DashboardChart
          title="Weekly Revenue"
          description="Revenue generated per week"
          data={revenueData}
          type="bar"
          dataKey="revenue"
          color="#10b981"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Assistant Status</CardTitle>
            <CardDescription>Your virtual assistant is active and handling calls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Online & Ready</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Last activity: 2 minutes ago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your business settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              • Update business hours
            </div>
            <div className="text-sm">
              • Customize AI greeting
            </div>
            <div className="text-sm">
              • Review missed calls
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
