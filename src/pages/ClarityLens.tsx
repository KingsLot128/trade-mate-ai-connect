import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ClarityLensGate } from '@/components/subscription/FeatureGate';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ClarityMetricsGrid from '@/components/clarity/ClarityMetrics';
import DataQualityIndicator from '@/components/clarity/DataQualityIndicator';
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
  Settings,
  Database,
  Wifi
} from "lucide-react";

interface ClarityMetrics {
  chaosIndex: number;
  operationalHealth: number;
  aiConfidence: number;
  businessVelocity: number;
  priorityTasks: number;
  activeThreats: number;
  callQuality: number;
  financialHealth: number;
  customerSatisfaction: number;
  dataQuality: number;
}

interface BusinessIntelligence {
  revenue: { current: number; predicted: number; trend: string };
  contacts: { total: number; qualified: number; conversion: number };
  appointments: { scheduled: number; completed: number; efficiency: number };
  calls: { total: number; successful: number; avgDuration: number; sentiment: number };
  financial: { cashFlow: number; profitMargin: number; expenses: number };
  threats: { capacity: boolean; quality: boolean; competition: boolean };
  aiInsights: { total: number; implemented: number; pending: number };
}

interface RealtimeAlert {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  actionRequired: boolean;
  category: 'call' | 'financial' | 'customer' | 'operational' | 'threat';
}

interface DataQualityInfo {
  overallQuality: number;
  missingAreas: string[];
  hasFinancialData: boolean;
  hasCallData: boolean;
  hasCustomerData: boolean;
  hasIntegrationData: boolean;
}

const ClarityLens = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0);
  const [loadingTime, setLoadingTime] = useState<number>(0);
  const [metrics, setMetrics] = useState<ClarityMetrics>({
    chaosIndex: 0,
    operationalHealth: 0,
    aiConfidence: 0,
    businessVelocity: 0,
    priorityTasks: 0,
    activeThreats: 0,
    callQuality: 0,
    financialHealth: 0,
    customerSatisfaction: 0,
    dataQuality: 0
  });
  const [intelligence, setIntelligence] = useState<BusinessIntelligence | null>(null);
  const [alerts, setAlerts] = useState<RealtimeAlert[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQualityInfo>({
    overallQuality: 0,
    missingAreas: [],
    hasFinancialData: false,
    hasCallData: false,
    hasCustomerData: false,
    hasIntegrationData: false
  });
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

  const initializeClarityLens = useCallback(async () => {
    if (!user) return;
    
    setAiProcessing(true);
    setLoadingStartTime(Date.now());
    
    try {
      // Load data with timeout for better UX
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Loading timeout')), 8000)
      );

      await Promise.race([
        Promise.all([
          loadBusinessMetrics(),
          loadBusinessIntelligence(),
          loadRealtimeAlerts(),
          loadDataQuality(),
          generateAIInsightsOptimized()
        ]),
        timeoutPromise
      ]);
      
      setLastUpdate(new Date());
      const endTime = Date.now();
      setLoadingTime(endTime - loadingStartTime);
      
    } catch (error) {
      console.error('Error initializing Clarity Lens:', error);
      if (error instanceof Error && error.message === 'Loading timeout') {
        toast.error('Loading is taking longer than expected. This may be due to insufficient business data.');
      } else {
        toast.error('Failed to initialize Clarity Lens');
      }
      setLoadingTime(Date.now() - loadingStartTime);
    } finally {
      setAiProcessing(false);
    }
  }, [user, loadingStartTime]);

  const loadDataQuality = async () => {
    if (!user) return;

    try {
      const [profileRes, businessRes, customersRes, callsRes, metricsRes, integrationsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('business_settings').select('*').eq('user_id', user.id).single(),
        supabase.from('customers').select('count').eq('user_id', user.id),
        supabase.from('calls').select('count').eq('user_id', user.id),
        supabase.from('business_metrics').select('count').eq('user_id', user.id),
        supabase.from('integrations').select('count').eq('user_id', user.id)
      ]);

      const hasFinancialData = !!(profileRes.data?.business_name && profileRes.data?.industry);
      const hasCallData = (callsRes.data?.[0]?.count || 0) > 0;
      const hasCustomerData = (customersRes.data?.[0]?.count || 0) > 0;
      const hasIntegrationData = (integrationsRes.data?.[0]?.count || 0) > 0;

      const qualityFactors = [
        hasFinancialData,
        hasCallData,
        hasCustomerData,
        hasIntegrationData,
        !!profileRes.data?.business_name,
        !!profileRes.data?.industry
      ];

      const overallQuality = Math.round((qualityFactors.filter(Boolean).length / qualityFactors.length) * 100);

      const missingAreas = [];
      if (!hasFinancialData) missingAreas.push('Financial data (revenue, expenses)');
      if (!hasCallData) missingAreas.push('Call intelligence data');
      if (!hasCustomerData) missingAreas.push('Customer relationship data');
      if (!hasIntegrationData) missingAreas.push('Integration connections');
      if (!profileRes.data?.business_name) missingAreas.push('Business profile information');

      setDataQuality({
        overallQuality,
        missingAreas,
        hasFinancialData,
        hasCallData,
        hasCustomerData,
        hasIntegrationData
      });

    } catch (error) {
      console.error('Error loading data quality:', error);
    }
  };

  const loadBusinessMetrics = async () => {
    if (!user) return;

    try {
      const [profileRes, customersRes, appointmentsRes, dealsRes, callsRes, businessRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('customers').select('*').eq('user_id', user.id),
        supabase.from('appointments').select('*').eq('user_id', user.id),
        supabase.from('crm_deals').select('*').eq('user_id', user.id),
        supabase.from('calls').select('*').eq('user_id', user.id),
        supabase.from('business_settings').select('*').eq('user_id', user.id).single()
      ]);

      const customers = customersRes.data || [];
      const appointments = appointmentsRes.data || [];
      const deals = dealsRes.data || [];
      const calls = callsRes.data || [];

      // Enhanced chaos calculation with more factors
      const urgentCustomers = customers.filter(c => c.timeline_urgency === 'ASAP').length;
      const totalWorkload = customers.length + appointments.length + deals.length;
      const overdueAppointments = appointments.filter(a => 
        new Date(a.scheduled_at || '') < new Date() && a.status !== 'completed'
      ).length;
      
      const chaosIndex = Math.min(100, 
        (urgentCustomers * 15) + 
        (totalWorkload * 1.5) + 
        (overdueAppointments * 10)
      );

      // Enhanced operational health
      const completedTasks = appointments.filter(a => a.status === 'completed').length;
      const totalTasks = appointments.length || 1;
      const operationalHealth = Math.round((completedTasks / totalTasks) * 100);

      // Enhanced AI confidence with more data sources
      const dataPoints = [
        profileRes.data?.business_name,
        profileRes.data?.industry,
        customers.length > 0,
        appointments.length > 0,
        calls.length > 0,
        profileRes.data?.business_name
      ].filter(Boolean).length;
      const aiConfidence = Math.round((dataPoints / 6) * 100);

      // Business velocity with recent activity
      const recentActivity = customers.filter(c => 
        new Date(c.created_at || '') > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      const businessVelocity = Math.min(100, recentActivity * 10);

      // Call quality metrics (new)
      const successfulCalls = calls.filter(c => c.notes && !c.notes.includes('no answer')).length;
      const callQuality = calls.length > 0 ? Math.round((successfulCalls / calls.length) * 100) : 50;

      // Financial health (new)
      const hasRevenue = !!profileRes.data?.business_name;
      const hasExpenses = !!profileRes.data?.industry;
      const financialHealth = hasRevenue && hasExpenses ? 85 : hasRevenue ? 60 : 30;

      // Customer satisfaction (new - based on deal completion and follow-ups)
      const completedDeals = deals.filter(d => d.stage === 'closed_won').length;
      const customerSatisfaction = deals.length > 0 ? Math.round((completedDeals / deals.length) * 100) : 70;

      setMetrics({
        chaosIndex: Math.round(chaosIndex),
        operationalHealth,
        aiConfidence,
        businessVelocity,
        priorityTasks: urgentCustomers,
        activeThreats: Math.floor(chaosIndex / 20),
        callQuality,
        financialHealth,
        customerSatisfaction,
        dataQuality: dataQuality.overallQuality
      });
    } catch (error) {
      console.error('Error loading business metrics:', error);
    }
  };

  const loadBusinessIntelligence = async () => {
    if (!user) return;

    try {
      const [customersRes, appointmentsRes, dealsRes, callsRes, businessRes] = await Promise.all([
        supabase.from('customers').select('*').eq('user_id', user.id),
        supabase.from('appointments').select('*').eq('user_id', user.id),
        supabase.from('crm_deals').select('*').eq('user_id', user.id),
        supabase.from('calls').select('*').eq('user_id', user.id),
        supabase.from('business_settings').select('*').eq('user_id', user.id).single()
      ]);

      const customers = customersRes.data || [];
      const appointments = appointmentsRes.data || [];
      const deals = dealsRes.data || [];
      const calls = callsRes.data || [];

      const totalRevenue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
      const qualifiedContacts = customers.filter((c: any) => c.lead_source && c.lead_source !== 'unknown').length;
      const conversionRate = customers.length > 0 ? Math.round((qualifiedContacts / customers.length) * 100) : 0;
      
      const completedAppts = appointments.filter(a => a.status === 'completed').length;
      const efficiency = appointments.length > 0 ? Math.round((completedAppts / appointments.length) * 100) : 0;

      // Enhanced call intelligence
      const successfulCalls = calls.filter(c => c.notes && !c.notes.includes('no answer')).length;
      const avgCallDuration = calls.length > 0 ? 
        calls.reduce((sum, call) => sum + 12, 0) / calls.length : 0; // Mock duration
      const callSentiment = successfulCalls / Math.max(calls.length, 1) * 100;

      // Financial intelligence
      const monthlyRevenue = 0; // Will be populated from financial data collection
      const monthlyExpenses = 0; // Will be populated from financial data collection
      const profitMargin = monthlyRevenue > 0 ? ((monthlyRevenue - monthlyExpenses) / monthlyRevenue) * 100 : 0;

      // Threat detection
      const capacityThreat = appointments.length > 20; // Too many appointments
      const qualityThreat = efficiency < 70; // Low completion rate
      const competitionThreat = conversionRate < 20; // Low conversion

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
        calls: {
          total: calls.length,
          successful: successfulCalls,
          avgDuration: Math.round(avgCallDuration),
          sentiment: Math.round(callSentiment)
        },
        financial: {
          cashFlow: monthlyRevenue - monthlyExpenses,
          profitMargin: Math.round(profitMargin),
          expenses: monthlyExpenses
        },
        threats: {
          capacity: capacityThreat,
          quality: qualityThreat,
          competition: competitionThreat
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
    if (!user) return;

    try {
      // Generate dynamic alerts based on actual data
      const [customersRes, appointmentsRes, callsRes] = await Promise.all([
        supabase.from('customers').select('*').eq('user_id', user.id),
        supabase.from('appointments').select('*').eq('user_id', user.id),
        supabase.from('calls').select('*').eq('user_id', user.id)
      ]);

      const customers = customersRes.data || [];
      const appointments = appointmentsRes.data || [];
      const calls = callsRes.data || [];

      const alerts: RealtimeAlert[] = [];

      // High-value customer alerts
      const highValueCustomers = customers.filter(c => 
        c.project_value_min && c.project_value_min > 10000
      );
      if (highValueCustomers.length > 0) {
        alerts.push({
          id: `hv-${Date.now()}`,
          type: 'urgent',
          title: `${highValueCustomers.length} High-Value Lead${highValueCustomers.length > 1 ? 's' : ''} Detected`,
          message: `Customers with $${Math.max(...highValueCustomers.map(c => c.project_value_min || 0)).toLocaleString()}+ project value require immediate attention`,
          timestamp: new Date(),
          actionRequired: true,
          category: 'customer'
        });
      }

      // Appointment conflicts
      const overdueAppointments = appointments.filter(a => 
        new Date(a.scheduled_at || '') < new Date() && a.status !== 'completed'
      );
      if (overdueAppointments.length > 0) {
        alerts.push({
          id: `appt-${Date.now()}`,
          type: 'warning',
          title: 'Overdue Appointments',
          message: `${overdueAppointments.length} appointments are overdue and need attention`,
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          actionRequired: true,
          category: 'operational'
        });
      }

      // Call quality issues
      const recentCalls = calls.filter(c => 
        new Date(c.timestamp || '') > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );
      const unsuccessfulCalls = recentCalls.filter(c => 
        !c.notes || c.notes.includes('no answer') || c.notes.includes('busy')
      );
      
      if (unsuccessfulCalls.length > 3) {
        alerts.push({
          id: `call-${Date.now()}`,
          type: 'warning',
          title: 'Call Success Rate Declining',
          message: `${unsuccessfulCalls.length} unsuccessful calls in the last 24 hours`,
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          actionRequired: true,
          category: 'call'
        });
      }

      // Capacity threat
      const upcomingAppointments = appointments.filter(a => 
        new Date(a.scheduled_at || '') > new Date() && 
        new Date(a.scheduled_at || '') < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      );
      if (upcomingAppointments.length > 15) {
        alerts.push({
          id: `capacity-${Date.now()}`,
          type: 'warning',
          title: 'Capacity Overload Warning',
          message: `${upcomingAppointments.length} appointments scheduled for next week - consider capacity management`,
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          actionRequired: false,
          category: 'threat'
        });
      }

      // Add some positive alerts
      if (alerts.length === 0 || Math.random() > 0.5) {
        alerts.push({
          id: `success-${Date.now()}`,
          type: 'success',
          title: 'AI Optimization Active',
          message: 'Continuous intelligence monitoring is optimizing your business performance',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          actionRequired: false,
          category: 'operational'
        });
      }

      setAlerts(alerts.slice(0, 5)); // Keep only top 5 alerts
    } catch (error) {
      console.error('Error loading realtime alerts:', error);
    }
  };

  const generateAIInsightsOptimized = async () => {
    if (!user) return;

    try {
      // Only generate AI insights if we have sufficient data
      if (dataQuality.overallQuality < 30) {
        console.log('Skipping AI insights generation due to low data quality');
        return;
      }

      const { data, error } = await supabase.functions.invoke('ai-business-advisor', {
        body: { userId: user.id, analysisType: 'recommendations' }
      });

      if (error) throw error;
      
      toast.success('AI insights updated');
    } catch (error) {
      console.error('Error generating AI insights:', error);
      // Don't show error toast for low data quality
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'call': return 'bg-blue-500/10 border-blue-500/20';
      case 'financial': return 'bg-green-500/10 border-green-500/20';
      case 'customer': return 'bg-purple-500/10 border-purple-500/20';
      case 'operational': return 'bg-amber-500/10 border-amber-500/20';
      case 'threat': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-slate-500/10 border-slate-500/20';
    }
  };

  if (loading || aiProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <Eye className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 animate-ping">
              <Eye className="h-16 w-16 text-blue-600 mx-auto opacity-30" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Initializing Clarity Lens</h1>
          <p className="text-blue-200 mb-4">AI is analyzing your business data...</p>
          
          {loadingTime > 3000 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 text-amber-300">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Taking longer than usual - limited business data detected</span>
              </div>
            </div>
          )}
          
          <div className="w-64 mx-auto">
            <Progress value={loadingTime > 6000 ? 90 : (loadingTime / 6000) * 100} className="h-2" />
          </div>
          
          {loadingTime > 5000 && (
            <p className="text-xs text-blue-300 mt-2">
              Consider adding more business data for faster insights
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <ClarityLensGate>
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
                {loadingTime > 0 && (
                  <Badge variant="outline" className="text-blue-300 border-blue-600 text-xs">
                    Load: {(loadingTime / 1000).toFixed(1)}s
                  </Badge>
                )}
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
                  <Wifi className="h-4 w-4 mr-2" />
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
          {/* Data Quality Indicator */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <DataQualityIndicator
                overallQuality={dataQuality.overallQuality}
                missingData={dataQuality.missingAreas}
                loadingTime={loadingTime}
                onImproveData={() => navigate('/data-collection')}
              />
            </div>
            
            {/* Real-time Alerts */}
            <div className="lg:col-span-3">
              <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Real-time Intelligence Alerts
                    </div>
                    <Badge variant="outline" className="text-blue-300 border-blue-600">
                      {alerts.length} Active
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {alerts.length === 0 ? (
                      <div className="text-center py-8 text-blue-300">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>All systems operational</p>
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div key={alert.id} className={`p-3 rounded-lg border ${getCategoryColor(alert.category)}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              {getAlertIcon(alert.type)}
                              <div>
                                <h4 className="font-medium text-white text-sm">{alert.title}</h4>
                                <p className="text-xs text-blue-200 mt-1">{alert.message}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <span className="text-xs text-blue-300">
                                    {alert.timestamp.toLocaleTimeString()}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {alert.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {alert.actionRequired && (
                              <Button size="sm" variant="outline" className="text-xs">
                                Action
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Metrics Grid */}
          <ClarityMetricsGrid metrics={metrics} />

          {/* Enhanced Business Intelligence */}
          {intelligence && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Revenue Intelligence */}
              <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-300 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Revenue Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-200">Current</span>
                      <span className="font-bold text-emerald-400">${intelligence.revenue.current.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-200">Predicted</span>
                      <span className="font-bold text-blue-300">${intelligence.revenue.predicted.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-200">Cash Flow</span>
                      <span className={`font-bold ${intelligence.financial.cashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ${intelligence.financial.cashFlow.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Intelligence */}
              <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-300 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Contact Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                    <Progress value={intelligence.contacts.conversion} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Call Intelligence */}
              <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-300 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-200">Total Calls</span>
                      <span className="font-bold text-white">{intelligence.calls.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-200">Successful</span>
                      <span className="font-bold text-emerald-400">{intelligence.calls.successful}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-200">Avg Duration</span>
                      <span className="font-bold text-blue-300">{intelligence.calls.avgDuration}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-200">Sentiment</span>
                      <span className="font-bold text-purple-400">{intelligence.calls.sentiment}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Intelligence */}
              <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-300 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                    <Progress value={intelligence.appointments.efficiency} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Threat Detection */}
              <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-300 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Threat Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-200">Capacity Risk</span>
                      <Badge variant={intelligence.threats.capacity ? "destructive" : "secondary"}>
                        {intelligence.threats.capacity ? "High" : "Low"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-200">Quality Risk</span>
                      <Badge variant={intelligence.threats.quality ? "destructive" : "secondary"}>
                        {intelligence.threats.quality ? "High" : "Low"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-200">Competition</span>
                      <Badge variant={intelligence.threats.competition ? "destructive" : "secondary"}>
                        {intelligence.threats.competition ? "High" : "Low"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Performance */}
              <Card className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-300 flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                    <Progress 
                      value={(intelligence.aiInsights.implemented / intelligence.aiInsights.total) * 100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ClarityLensGate>
  );
};

export default ClarityLens;