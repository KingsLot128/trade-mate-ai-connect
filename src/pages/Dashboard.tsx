import React from 'react';
import { BusinessHealthDashboard } from '@/components/dashboard/BusinessHealthDashboard';
import { ChaosIndexWidget } from '@/components/dashboard/ChaosIndexWidget';
import { QuickMetricsGrid } from '@/components/dashboard/QuickMetricsGrid';
import ProfileCompletionGuide from '@/components/profile/ProfileCompletionGuide';
import RecommendationBootstrap from '@/components/ai/RecommendationBootstrap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Target, TrendingUp, Brain, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Intelligence Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights into your business health and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/revenue-recovery')}>
            <DollarSign className="h-4 w-4 mr-2" />
            Revenue Recovery
          </Button>
          <Button variant="outline" onClick={() => navigate('/feed')}>
            <Sparkles className="h-4 w-4 mr-2" />
            View Insights
          </Button>
          <Button onClick={() => navigate('/clarity')}>
            <Target className="h-4 w-4 mr-2" />
            ClarityLens
          </Button>
        </div>
      </div>

      {/* Profile Completion Guide */}
      <ProfileCompletionGuide />

      {/* Quick Metrics Grid */}
      <QuickMetricsGrid />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Health (takes 2 columns) */}
        <div className="lg:col-span-2">
          <BusinessHealthDashboard />
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* AI Setup & Recommendations */}
          <RecommendationBootstrap />

          {/* Chaos Index Widget */}
          <ChaosIndexWidget />

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/feed')}
              >
                <span>Intelligence Feed</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/integrations')}
              >
                <span>Connect Tools</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/health')}
              >
                <span>Health Score</span>
                <TrendingUp className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile Setup</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Business Health</span>
                  <span className="text-sm font-medium">Good</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Recommendations</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <Button size="sm" variant="secondary" className="w-full">
                  View All Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;