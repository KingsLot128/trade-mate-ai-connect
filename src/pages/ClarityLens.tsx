import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Eye, 
  Brain, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target, 
  Zap,
  Users,
  DollarSign,
  Phone,
  Calendar,
  BarChart3,
  RefreshCw,
  Settings
} from "lucide-react";

interface ClarityMetrics {
  chaosIndex: number;
  operationalHealth: number;
  aiConfidence: number;
  businessVelocity: number;
  priorityTasks: number;
  activeThreats: number;
}

interface BusinessIntelligence {
  revenue: { current: number; predicted: number; trend: string };
  contacts: { total: number; qualified: number; conversion: number };
  appointments: { scheduled: number; completed: number; efficiency: number };
  aiInsights: { total: number; implemented: number; pending: number };
}

interface RealtimeAlert {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  actionRequired: boolean;
}

const ClarityLens = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<ClarityMetrics>({
    chaosIndex: 0,
    operationalHealth: 0,
    aiConfidence: 0,
    businessVelocity: 0,
    priorityTasks: 0,
    activeThreats: 0
  });
  const [intelligence, setIntelligence] = useState<BusinessIntelligence | null>(null);
  const [alerts, setAlerts] = useState<RealtimeAlert[]>([]);
  const [isObserverMode, setIsObserverMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [aiProcessing, setAiProcessing] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else {
        initializeClarityLens();
      }
    }
  }, [user, loading, navigate]);

  const initializeClarityLens = async () => {
    if (!user) return;
    
    setAiProcessing(true);
    try {
      await Promise.all([
        loadBusinessMetrics(),
        loadBusinessIntelligence(),
        loadRealtimeAlerts(),
        generateAIInsights()
      ]);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error initializing Clarity Lens:', error);
      toast.error('Failed to initialize Clarity Lens');
    } finally {
      setAiProcessing(false);
    }
  };

  const loadBusinessMetrics = async () => {
    if (!user) return;

    try {
      const [profileRes, customersRes, appointmentsRes, dealsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('customers').select('*').eq('user_id', user.id),
        supabase.from('appointments').select('*').eq('user_id', user.id),
        supabase.from('crm_deals').select('*').eq('user_id', user.id)
      ]);

      const customers = customersRes.data || [];
      const appointments = appointmentsRes.data || [];
      const deals = dealsRes.data || [];

      // Calculate chaos index based on workload and urgency
      const urgentCustomers = customers.filter(c => c.timeline_urgency === 'ASAP').length;
      const totalWorkload = customers.length + appointments.length + deals.length;
      const chaosIndex = Math.min(100, (urgentCustomers * 20) + (totalWorkload * 2));

      // Calculate operational health
      const completedTasks = appointments.filter(a => a.status === 'completed').length;
      const totalTasks = appointments.length || 1;
      const operationalHealth = Math.round((completedTasks / totalTasks) * 100);

      // AI confidence based on data completeness
      const dataPoints = [
        profileRes.data?.business_name,
        profileRes.data?.industry,
        customers.length > 0,
        appointments.length > 0
      ].filter(Boolean).length;
      const aiConfidence = Math.round((dataPoints / 4) * 100);

      // Business velocity based on recent activity
      const recentActivity = customers.filter(c => 
        new Date(c.created_at || '') > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      const businessVelocity = Math.min(100, recentActivity * 10);

      setMetrics({
        chaosIndex,
        operationalHealth,
        aiConfidence,
        businessVelocity,
        priorityTasks: urgentCustomers,
        activeThreats: Math.floor(chaosIndex / 25)
      });
    } catch (error) {
      console.error('Error loading business metrics:', error);
    }
  };

  const loadBusinessIntelligence = async () => {
    if (!user) return;

    try {
      const [customersRes, appointmentsRes, dealsRes] = await Promise.all([
        supabase.from('customers').select('*').eq('user_id', user.id),
        supabase.from('appointments').select('*').eq('user_id', user.id),
        supabase.from('crm_deals').select('*').eq('user_id', user.id)
      ]);

      const customers = customersRes.data || [];
      const appointments = appointmentsRes.data || [];
      const deals = dealsRes.data || [];

      const totalRevenue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
      const qualifiedContacts = customers.filter((c: any) => c.lead_source && c.lead_source !== 'unknown').length;
      const conversionRate = customers.length > 0 ? Math.round((qualifiedContacts / customers.length) * 100) : 0;
      
      const completedAppts = appointments.filter(a => a.status === 'completed').length;
      const efficiency = appointments.length > 0 ? Math.round((completedAppts / appointments.length) * 100) : 0;

      setIntelligence({
        revenue: {
          current: totalRevenue,
          predicted: totalRevenue * 1.2,
          trend: totalRevenue > 0 ? 'up' : 'stable'
        },
        contacts: {
          total: customers.length,
          qualified: qualifiedContacts,
          conversion: conversionRate
        },
        appointments: {
          scheduled: appointments.length,
          completed: completedAppts,
          efficiency
        },
        aiInsights: {
          total: 12,
          implemented: 8,
          pending: 4
        }
      });
    } catch (error) {
      console.error('Error loading business intelligence:', error);
    }
  };

  const loadRealtimeAlerts = async () => {
    const mockAlerts: RealtimeAlert[] = [
      {
        id: '1',
        type: 'urgent',
        title: 'High-Value Lead Detected',
        message: 'New customer with $15K+ project value requires immediate attention',
        timestamp: new Date(),
        actionRequired: true
      },
      {
        id: '2',
        type: 'warning',
        title: 'Appointment Conflict',
        message: '2 appointments scheduled for the same time slot',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        actionRequired: true
      },
      {
        id: '3',
        type: 'success',
        title: 'AI Optimization Complete',
        message: 'Route optimization improved efficiency by 23%',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        actionRequired: false
      }
    ];
    setAlerts(mockAlerts);
  };

  const generateAIInsights = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('ai-business-advisor', {
        body: { userId: user.id, analysisType: 'recommendations' }
      });

      if (error) throw error;
      
      toast.success('AI insights updated');
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }
  };

  const getMetricColor = (value: number, inverse = false) => {
    if (inverse) {
      if (value < 30) return 'text-emerald-600';
      if (value < 70) return 'text-amber-600';
      return 'text-red-600';
    } else {
      if (value < 30) return 'text-red-600';
      if (value < 70) return 'text-amber-600';
      return 'text-emerald-600';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-blue-600" />;
    }
  };

  if (loading || aiProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <Eye className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 animate-ping">
              <Eye className="h-16 w-16 text-blue-600 mx-auto opacity-30" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Initializing Clarity Lens</h1>
          <p className="text-blue-200">AI is analyzing your business data...</p>
          <div className="mt-4 w-64 mx-auto">
            <Progress value={75} className="h-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-blue-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Eye className="h-8 w-8 text-blue-400" />
                {isObserverMode && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Clarity Lens</h1>
                <p className="text-blue-200 text-sm">Observer OS • TradeMate AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-300 border-blue-600">
                Last Update: {lastUpdate.toLocaleTimeString()}
              </Badge>
              <Button
                onClick={() => setIsObserverMode(!isObserverMode)}
                variant={isObserverMode ? "default" : "outline"}
                size="sm"
                className={isObserverMode ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {isObserverMode ? "Observer Active" : "Activate Observer"}
              </Button>
              <Button
                onClick={initializeClarityLens}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-300 hover:bg-blue-900/50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Operational Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wide">Chaos Index</p>
                  <p className={`text-2xl font-bold ${getMetricColor(metrics.chaosIndex, true)}`}>
                    {metrics.chaosIndex}%
                  </p>
                </div>
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wide">Op Health</p>
                  <p className={`text-2xl font-bold ${getMetricColor(metrics.operationalHealth)}`}>
                    {metrics.operationalHealth}%
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wide">AI Confidence</p>
                  <p className={`text-2xl font-bold ${getMetricColor(metrics.aiConfidence)}`}>
                    {metrics.aiConfidence}%
                  </p>
                </div>
                <Brain className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wide">Velocity</p>
                  <p className={`text-2xl font-bold ${getMetricColor(metrics.businessVelocity)}`}>
                    {metrics.businessVelocity}%
                  </p>
                </div>
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wide">Priority Tasks</p>
                  <p className="text-2xl font-bold text-amber-400">{metrics.priorityTasks}</p>
                </div>
                <Target className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wide">Threats</p>
                  <p className="text-2xl font-bold text-red-400">{metrics.activeThreats}</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Intelligence */}
        {intelligence && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-300 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Revenue Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-200">Current</span>
                    <span className="font-bold text-emerald-400">${intelligence.revenue.current.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-200">Predicted</span>
                    <span className="font-bold text-blue-300">${intelligence.revenue.predicted.toLocaleString()}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-300 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Contact Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-200">Total</span>
                    <span className="font-bold text-white">{intelligence.contacts.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-200">Qualified</span>
                    <span className="font-bold text-emerald-400">{intelligence.contacts.qualified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-200">Conversion</span>
                    <span className="font-bold text-blue-300">{intelligence.contacts.conversion}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-300 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-200">Scheduled</span>
                    <span className="font-bold text-white">{intelligence.appointments.scheduled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-200">Completed</span>
                    <span className="font-bold text-emerald-400">{intelligence.appointments.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-200">Efficiency</span>
                    <span className="font-bold text-blue-300">{intelligence.appointments.efficiency}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-300 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  AI Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-200">Total Insights</span>
                    <span className="font-bold text-white">{intelligence.aiInsights.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-200">Implemented</span>
                    <span className="font-bold text-emerald-400">{intelligence.aiInsights.implemented}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-200">Pending</span>
                    <span className="font-bold text-amber-400">{intelligence.aiInsights.pending}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Real-time Alerts */}
        <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-blue-300 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Real-time Intelligence Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/50 border-l-4 border-blue-500"
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-blue-300">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                        {alert.actionRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-blue-200 mt-1">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => navigate('/dashboard?tab=insights')}
            className="bg-blue-600 hover:bg-blue-700 h-16"
          >
            <div className="text-center">
              <Brain className="h-6 w-6 mx-auto mb-1" />
              <span className="text-sm">AI Insights</span>
            </div>
          </Button>
          <Button
            onClick={() => navigate('/dashboard?tab=decisions')}
            className="bg-purple-600 hover:bg-purple-700 h-16"
          >
            <div className="text-center">
              <Target className="h-6 w-6 mx-auto mb-1" />
              <span className="text-sm">Decision Feed</span>
            </div>
          </Button>
          <Button
            onClick={() => navigate('/dashboard?tab=contacts')}
            className="bg-emerald-600 hover:bg-emerald-700 h-16"
          >
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-1" />
              <span className="text-sm">Client Command</span>
            </div>
          </Button>
          <Button
            onClick={() => navigate('/dashboard?tab=settings')}
            className="bg-slate-600 hover:bg-slate-700 h-16"
          >
            <div className="text-center">
              <Settings className="h-6 w-6 mx-auto mb-1" />
              <span className="text-sm">System Config</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClarityLens;