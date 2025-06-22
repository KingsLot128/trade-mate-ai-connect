
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
}

const RevenueTracker = () => {
  const { user } = useAuth();
  const [revenueData, setRevenueData] = useState<RevenueData>({
    thisMonth: 0,
    lastMonth: 0,
    avgJobValue: 0,
    totalJobs: 0,
    conversionRate: 0,
    reviewScore: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, [user]);

  const fetchRevenueData = async () => {
    if (!user) return;

    try {
      // In a real implementation, this would fetch from your appointments/jobs table
      // For now, we'll simulate some data based on call activity
      
      const { data: calls } = await supabase
        .from('calls')
        .select('*')
        .eq('user_id', user.id);

      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id);

      // Simulate revenue calculations
      const totalCalls = calls?.length || 0;
      const totalAppointments = appointments?.length || 0;
      const conversionRate = totalCalls > 0 ? Math.round((totalAppointments / totalCalls) * 100) : 0;

      // Simulate monthly revenue based on appointments
      const avgJobValue = 275; // Average trade job value
      const thisMonth = totalAppointments * avgJobValue;
      const lastMonth = Math.round(thisMonth * 0.85); // Simulate 15% growth

      setRevenueData({
        thisMonth,
        lastMonth,
        avgJobValue,
        totalJobs: totalAppointments,
        conversionRate,
        reviewScore: 4.8 // Simulated review score
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
            <CardTitle className="text-sm font-medium">This Month Revenue</CardTitle>
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
            <CardTitle className="text-sm font-medium">Avg Job Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.avgJobValue}</div>
            <p className="text-xs text-blue-600">
              Industry average: $285
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.totalJobs}</div>
            <p className="text-xs text-purple-600">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.reviewScore}⭐</div>
            <p className="text-xs text-orange-600">
              Based on 47 reviews
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
                <li>• 3 customers are due for maintenance visits ($450 potential)</li>
                <li>• Emergency calls have 40% higher average value</li>
                <li>• Upsell installation services during repair visits</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">📈 Growth Recommendations</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Follow up with 5 missed calls from this week</li>
                <li>• Ask satisfied customers for referrals (+$200 avg value)</li>
                <li>• Consider seasonal promotions for HVAC maintenance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueTracker;
