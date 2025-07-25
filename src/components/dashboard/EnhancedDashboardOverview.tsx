import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Zap,
  Brain,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';

interface DashboardMetrics {
  businessHealth: number;
  totalLeads: number;
  activeDeals: number;
  monthlyRevenue: number;
  chaosScore: number;
  clarityZone: 'chaos' | 'control' | 'clarity';
}

const EnhancedDashboardOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    businessHealth: 0,
    totalLeads: 0,
    activeDeals: 0,
    monthlyRevenue: 0,
    chaosScore: 0,
    clarityZone: 'control'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardMetrics();
    }
  }, [user]);

  const loadDashboardMetrics = async () => {
    try {
      setIsLoading(true);
      
      // Load user profile for chaos score
      const { data: profile } = await supabase
        .from('profiles')
        .select('chaos_score, clarity_zone')
        .eq('user_id', user?.id)
        .single();

      // Load CRM data
      const { data: contacts } = await supabase
        .from('crm_contacts')
        .select('id, status')
        .eq('user_id', user?.id);

      const { data: deals } = await supabase
        .from('crm_deals')
        .select('id, amount, stage')
        .eq('user_id', user?.id);

      const chaosScore = profile?.chaos_score || 50;
      const clarityZone = (profile?.clarity_zone && isValidClarityZone(profile.clarity_zone)) 
        ? profile.clarity_zone 
        : getClarityZone(chaosScore);
      const businessHealth = Math.max(0, 100 - chaosScore);

      setMetrics({
        businessHealth,
        totalLeads: contacts?.length || 0,
        activeDeals: deals?.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length || 0,
        monthlyRevenue: deals?.reduce((sum, deal) => sum + (deal.amount || 0), 0) || 0,
        chaosScore,
        clarityZone
      });
    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getClarityZone = (score: number): 'chaos' | 'control' | 'clarity' => {
    if (score >= 70) return 'chaos';
    if (score >= 40) return 'control';
    return 'clarity';
  };

  const isValidClarityZone = (zone: any): zone is 'chaos' | 'control' | 'clarity' => {
    return zone === 'chaos' || zone === 'control' || zone === 'clarity';
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'chaos': return 'text-red-600 bg-red-50 border-red-200';
      case 'control': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'clarity': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const quickAccessItems = [
    {
      id: 'business-health',
      title: 'Business Health Score',
      description: 'Track your overall business performance',
      icon: Target,
      badge: 'NEW',
      badgeColor: 'bg-green-500',
      action: () => navigate('/dashboard?tab=business-health')
    },
    {
      id: 'intelligence-feed',
      title: 'AI Intelligence Feed',
      description: 'Personalized recommendations and insights',
      icon: Brain,
      badge: 'AI',
      badgeColor: 'bg-purple-500',
      action: () => navigate('/dashboard?tab=intelligence-feed')
    },
    {
      id: 'builtin-tools',
      title: 'Smart Tools',
      description: 'CRM, Bookkeeping, and Calendar in one place',
      icon: Zap,
      badge: 'SMART',
      badgeColor: 'bg-blue-500',
      action: () => navigate('/dashboard?tab=builtin-tools')
    },
    {
      id: 'integration-hub',
      title: 'Integration Hub',
      description: 'Connect your existing tools or use built-ins',
      icon: BarChart3,
      badge: 'HUB',
      badgeColor: 'bg-indigo-500',
      action: () => navigate('/dashboard?tab=integration-hub')
    }
  ];

  if (isLoading) {
    return (
      <div className="enhanced-dashboard-overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-dashboard-overview space-y-8">
      {/* Welcome Header */}
      <div className="welcome-header">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back! 👋
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Your business intelligence command center
            </p>
          </div>
          
          {/* Clarity Zone Badge */}
          <div className={`px-6 py-3 rounded-full border-2 ${getZoneColor(metrics.clarityZone)}`}>
            <div className="text-center">
              <div className="text-sm font-medium">Current Zone</div>
              <div className="text-lg font-bold uppercase">{metrics.clarityZone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="business-health-card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 font-medium">Business Health</div>
                <div className="text-3xl font-bold text-green-700">{metrics.businessHealth}%</div>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4 text-green-700 hover:bg-green-100"
              onClick={() => navigate('/dashboard?tab=business-health')}
            >
              View Details <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="leads-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Leads</div>
                <div className="text-3xl font-bold">{metrics.totalLeads}</div>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="deals-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Active Deals</div>
                <div className="text-3xl font-bold">{metrics.activeDeals}</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="revenue-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Pipeline Value</div>
                <div className="text-3xl font-bold">${metrics.monthlyRevenue.toLocaleString()}</div>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Features Section */}
      <div className="enhanced-features">
        <div className="flex items-center mb-6">
          <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
          <h2 className="text-2xl font-bold">Enhanced Features</h2>
          <Badge className="ml-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Recently Added
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickAccessItems.map(item => {
            const Icon = item.icon;
            return (
              <Card key={item.id} className="enhanced-feature-card hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={item.action}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                    </div>
                    <Badge className={`${item.badgeColor} text-white text-xs font-bold`}>
                      {item.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                  <Button variant="outline" className="w-full group">
                    Explore Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-16 flex items-center justify-center text-left p-4"
            onClick={() => navigate('/enhanced-quiz')}
          >
            <div className="flex items-center">
              <Brain className="w-6 h-6 text-purple-500 mr-3" />
              <div>
                <div className="font-medium">Retake Assessment</div>
                <div className="text-sm text-muted-foreground">Update your chaos score</div>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-16 flex items-center justify-center text-left p-4"
            onClick={() => navigate('/dashboard?tab=contacts')}
          >
            <div className="flex items-center">
              <Users className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <div className="font-medium">Add New Contact</div>
                <div className="text-sm text-muted-foreground">Grow your network</div>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-16 flex items-center justify-center text-left p-4"
            onClick={() => navigate('/dashboard?tab=deals')}
          >
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <div className="font-medium">Create New Deal</div>
                <div className="text-sm text-muted-foreground">Track opportunities</div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboardOverview;