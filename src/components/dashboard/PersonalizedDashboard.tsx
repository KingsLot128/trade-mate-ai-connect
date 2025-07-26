import React from 'react';
import { BusinessHealthDashboard } from '@/components/dashboard/BusinessHealthDashboard';
import { ChaosIndexWidget } from '@/components/dashboard/ChaosIndexWidget';
import { QuickMetricsGrid } from '@/components/dashboard/QuickMetricsGrid';
import ProfileCompletionGuide from '@/components/profile/ProfileCompletionGuide';
import RecommendationBootstrap from '@/components/ai/RecommendationBootstrap';
import DashboardCustomizer from '@/components/dashboard/DashboardCustomizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Target, TrendingUp, Brain, DollarSign, Crown, BarChart3, Briefcase, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext';

const PersonalizedDashboard = () => {
  const navigate = useNavigate();
  const { preferences, availableWidgets, loading } = useDashboard();

  if (loading || !preferences) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-2"></div>
            <div className="h-4 bg-muted rounded w-96"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'executive': return <Crown className="h-5 w-5 text-yellow-600" />;
      case 'analyst': return <BarChart3 className="h-5 w-5 text-blue-600" />;
      case 'operator': return <Briefcase className="h-5 w-5 text-green-600" />;
      default: return <User className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'executive': return 'Executive Dashboard';
      case 'analyst': return 'Business Analytics Dashboard';
      case 'operator': return 'Operations Dashboard';
      default: return 'Business Intelligence Dashboard';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'executive': return 'Strategic insights and high-level business performance';
      case 'analyst': return 'Detailed analytics and data-driven insights';
      case 'operator': return 'Operational metrics and daily task management';
      default: return 'Real-time insights into your business health and performance';
    }
  };

  const renderWidget = (widgetId: string) => {
    const widget = availableWidgets.find(w => w.id === widgetId);
    if (!widget) return null;

    // Apply any widget-specific settings
    const settings = preferences.widget_settings[widgetId] || {};

    switch (widget.component) {
      case 'ProfileCompletionGuide':
        return <ProfileCompletionGuide key={widgetId} {...settings} />;
      case 'QuickMetricsGrid':
        return <QuickMetricsGrid key={widgetId} {...settings} />;
      case 'BusinessHealthDashboard':
        return <BusinessHealthDashboard key={widgetId} {...settings} />;
      case 'ChaosIndexWidget':
        return <ChaosIndexWidget key={widgetId} {...settings} />;
      case 'RecommendationBootstrap':
        return <RecommendationBootstrap key={widgetId} {...settings} />;
      case 'QuickActions':
        return <QuickActionsWidget key={widgetId} actions={preferences.quick_actions} />;
      case 'TodaysFocus':
        return <TodaysFocusWidget key={widgetId} role={preferences.dashboard_role} />;
      case 'RevenueMetrics':
        return <RevenueMetricsWidget key={widgetId} />;
      default:
        return null;
    }
  };

  const activeWidgets = preferences.active_widgets;
  const columns = preferences.layout_config.columns || { lg: 3, md: 2, sm: 1 };

  // Role-based layout adjustments
  const layoutClass = preferences.dashboard_role === 'executive' 
    ? `grid-cols-1 lg:grid-cols-${Math.min(columns.lg, 2)}` // Executives prefer larger widgets
    : `grid-cols-1 md:grid-cols-${columns.md} lg:grid-cols-${columns.lg}`;

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Role Badge */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {getRoleIcon(preferences.dashboard_role)}
            <h1 className="text-3xl font-bold">{getRoleTitle(preferences.dashboard_role)}</h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              {preferences.dashboard_role.charAt(0).toUpperCase() + preferences.dashboard_role.slice(1)} View
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {getRoleDescription(preferences.dashboard_role)}
          </p>
        </div>
        <div className="flex gap-2">
          <DashboardCustomizer />
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

      {/* Dynamic Widget Grid */}
      <div className={`grid ${layoutClass} gap-6`}>
        {activeWidgets.map((widgetId, index) => {
          const widget = renderWidget(widgetId);
          if (!widget) return null;

          // Special layout handling for certain widgets
          if (widgetId === 'business-health' && preferences.dashboard_role !== 'operator') {
            return (
              <div key={widgetId} className="lg:col-span-2">
                {widget}
              </div>
            );
          }

          return (
            <div key={widgetId}>
              {widget}
            </div>
          );
        })}
      </div>

      {/* Active Widgets Summary for debugging/info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Dashboard Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <p><strong>Role:</strong> {preferences.dashboard_role}</p>
              <p><strong>Active Widgets:</strong> {activeWidgets.length}</p>
              <p><strong>Available Widgets:</strong> {availableWidgets.length}</p>
              <p><strong>Layout:</strong> {JSON.stringify(columns)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Custom Widget Components
const QuickActionsWidget = ({ actions }: { actions: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Quick Actions</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {actions.map((action, index) => (
        <Button 
          key={index}
          variant="outline" 
          className="w-full justify-between"
          onClick={() => window.location.href = action.url}
        >
          <span>{action.name}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      ))}
    </CardContent>
  </Card>
);

const TodaysFocusWidget = ({ role }: { role: string }) => {
  const focusItems = role === 'executive' 
    ? [
        { label: 'Revenue Growth', value: '+12%', status: 'good' },
        { label: 'Team Performance', value: '8.4/10', status: 'good' },
        { label: 'Strategic Goals', value: '3/5', status: 'warning' }
      ]
    : role === 'analyst'
    ? [
        { label: 'Data Quality', value: '94%', status: 'good' },
        { label: 'Report Completion', value: '7/10', status: 'warning' },
        { label: 'Insights Generated', value: '15', status: 'good' }
      ]
    : [
        { label: 'Profile Setup', value: '85%', status: 'good' },
        { label: 'Business Health', value: 'Good', status: 'good' },
        { label: 'Active Recommendations', value: '3', status: 'good' }
      ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Focus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {focusItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{item.label}</span>
              <span className={`text-sm font-medium ${
                item.status === 'good' ? 'text-green-600' : 
                item.status === 'warning' ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {item.value}
              </span>
            </div>
          ))}
          <Button size="sm" variant="secondary" className="w-full">
            View All Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const RevenueMetricsWidget = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <DollarSign className="h-5 w-5" />
        Revenue Insights
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Monthly Revenue</span>
          <span className="text-sm font-medium text-green-600">$24,500</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Opportunities</span>
          <span className="text-sm font-medium">12 Active</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Conversion Rate</span>
          <span className="text-sm font-medium">68%</span>
        </div>
        <Button size="sm" variant="secondary" className="w-full">
          View Revenue Recovery
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default PersonalizedDashboard;