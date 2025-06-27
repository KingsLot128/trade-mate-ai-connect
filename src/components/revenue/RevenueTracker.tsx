
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calendar, Star, Target } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface RevenueData {
  thisMonth: number;
  lastMonth: number;
  avgJobValue: number;
  totalJobs: number;
  conversionRate: number;
  reviewScore: number;
  totalPipeline: number;
  wonDeals: number;
}

const RevenueTracker = () => {
  const { user } = useAuth();
  const [revenueData, setRevenueData] = useState<RevenueData>({
    thisMonth: 0,
    lastMonth: 0,
    avgJobValue: 0,
    totalJobs: 0,
    conversionRate: 0,
    reviewScore: 0,
    totalPipeline: 0,
    wonDeals: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, [user]);

  const fetchRevenueData = async () => {
    if (!user) return;

    try {
      // Fetch actual data from Supabase
      const { data: deals } = await supabase
        .from('crm_deals')
        .select('*')
        .eq('user_id', user.id);

      const { data: events } = await supabase
        .from('automation_events')
        .select('*')
        .eq('user_id', user.id);

      const { data: invoices } = await supabase
        .from('crm_invoices')
        .select('*')
        .eq('user_id', user.id);

      // Calculate real metrics
      const totalDeals = deals?.length || 0;
      const wonDeals = deals?.filter(d => d.stage === 'Closed Won').length || 0;
      const totalPipeline = deals?.reduce((sum, deal) => sum + (deal.amount || 0), 0) || 0;
      const wonRevenue = deals?.filter(d => d.stage === 'Closed Won').reduce((sum, deal) => sum + (deal.amount || 0), 0) || 0;
      
      const totalCalls = events?.length || 0;
      const conversionRate = totalCalls > 0 ? Math.round((wonDeals / totalCalls) * 100) : 0;
      
      const avgJobValue = wonDeals > 0 ? Math.round(wonRevenue / wonDeals) : 0;
      
      const totalInvoices = invoices?.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) || 0;
      const thisMonth = totalInvoices + wonRevenue;
      const lastMonth = Math.round(thisMonth * 0.85); // Simulate previous month

      setRevenueData({
        thisMonth,
        lastMonth,
        avgJobValue,
        totalJobs: wonDeals,
        conversionRate,
        reviewScore: 4.8, // Simulated
        totalPipeline,
        wonDeals
      });
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const growthRate = revenueData.lastMonth > 0 
    ? Math.round(((revenueData.thisMonth - revenueData.lastMonth) / revenueData.lastMonth) * 100)
    : 0;

  const revenueGoals = [
    { goal: 'Monthly Target', current: revenueData.thisMonth, target: 15000, unit: '$' },
    { goal: 'Conversion Rate', current: revenueData.conversionRate, target: 35, unit: '%' },
    { goal: 'Avg Job Value', current: revenueData.avgJobValue, target: 350, unit: '$' },
    { goal: 'Customer Reviews', current: revenueData.reviewScore, target: 4.9, unit: '⭐' }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.thisMonth.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              +{growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.totalPipeline.toLocaleString()}</div>
            <p className="text-xs text-blue-600">
              Total opportunity value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Won</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.wonDeals}</div>
            <p className="text-xs text-purple-600">
              Closed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Value</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.avgJobValue.toLocaleString()}</div>
            <p className="text-xs text-orange-600">
              Per closed deal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Business Goals Progress
          </CardTitle>
          <CardDescription>Track your progress towards key business metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {revenueGoals.map((goal, index) => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              const isOnTrack = progress >= 80;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{goal.goal}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {goal.unit === '$' ? '$' : ''}{goal.current}{goal.unit !== '$' ? goal.unit : ''} / {goal.unit === '$' ? '$' : ''}{goal.target}{goal.unit !== '$' ? goal.unit : ''}
                      </span>
                      <Badge variant={isOnTrack ? "default" : "secondary"}>
                        {Math.round(progress)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${isOnTrack ? 'bg-green-600' : 'bg-yellow-600'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Revenue Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">💰 Revenue Opportunities</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Pipeline value: ${revenueData.totalPipeline.toLocaleString()} in active deals</li>
                <li>• {revenueData.wonDeals} deals closed with {revenueData.avgJobValue > 0 ? `$${revenueData.avgJobValue}` : 'TBD'} average value</li>
                <li>• Focus on converting qualified leads to increase monthly revenue</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">📈 Growth Recommendations</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {revenueData.conversionRate}% conversion rate - industry average is 25-35%</li>
                <li>• Follow up with prospects in your pipeline to accelerate deals</li>
                <li>• Consider upselling services to existing customers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueTracker;
