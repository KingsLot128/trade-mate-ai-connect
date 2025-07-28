import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Brain, 
  Target, 
  Users, 
  DollarSign, 
  Phone,
  Database,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Trophy,
  Flame,
  Star
} from 'lucide-react';

interface HealthMetrics {
  overall: number;
  dataQuality: number;
  operationalEfficiency: number;
  financialHealth: number;
  customerSatisfaction: number;
  chaosIndex: number;
  aiConfidence: number;
  callQuality: number;
  trend: 'up' | 'down' | 'stable';
}

interface HealthFactor {
  name: string;
  score: number;
  weight: number;
  icon: React.ComponentType<any>;
  description: string;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  actionRequired: boolean;
  route?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
  threshold: number;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const BusinessHealthScore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<HealthMetrics>({
    overall: 0,
    dataQuality: 0,
    operationalEfficiency: 0,
    financialHealth: 0,
    customerSatisfaction: 0,
    chaosIndex: 0,
    aiConfidence: 0,
    callQuality: 0,
    trend: 'stable'
  });
  const [factors, setFactors] = useState<HealthFactor[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (user) {
      loadBusinessHealth();
    }
  }, [user]);

  const loadBusinessHealth = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load comprehensive business data
      const [profileRes, customersRes, callsRes, dealsRes, businessRes, integrationRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('customers').select('*').eq('user_id', user.id),
        supabase.from('calls').select('*').eq('user_id', user.id),
        supabase.from('crm_deals').select('*').eq('user_id', user.id),
        supabase.from('business_settings').select('*').eq('user_id', user.id).single(),
        supabase.from('integrations').select('*').eq('user_id', user.id)
      ]);

      const profile = profileRes.data;
      const customers = customersRes.data || [];
      const calls = callsRes.data || [];
      const deals = dealsRes.data || [];
      const integrations = integrationRes.data || [];

      // Calculate health factors using modern business logic
      const healthFactors = calculateHealthFactors({
        profile,
        customers,
        calls,
        deals,
        integrations
      });

      setFactors(healthFactors);

      // Calculate overall metrics
      const overall = calculateOverallHealth(healthFactors);
      const dataQuality = calculateDataQuality({ profile, customers, calls, deals, integrations });
      const chaosIndex = profile?.chaos_score || 0;
      
      setMetrics({
        overall,
        dataQuality,
        operationalEfficiency: healthFactors.find(f => f.name === 'Operations')?.score || 0,
        financialHealth: healthFactors.find(f => f.name === 'Financial')?.score || 0,
        customerSatisfaction: healthFactors.find(f => f.name === 'Customer Success')?.score || 0,
        chaosIndex,
        aiConfidence: healthFactors.find(f => f.name === 'AI Intelligence')?.score || 0,
        callQuality: healthFactors.find(f => f.name === 'Call Performance')?.score || 0,
        trend: determineTrend(overall, profile?.business_health_score || 0)
      });

      // Generate achievements
      setAchievements(generateAchievements(healthFactors, { profile, customers, calls, deals }));
      setLastUpdate(new Date());

      // Update profile with new health score
      if (overall !== profile?.business_health_score) {
        await supabase
          .from('profiles')
          .update({ business_health_score: Math.round(overall) })
          .eq('user_id', user.id);
      }

    } catch (error) {
      console.error('Error loading business health:', error);
      toast.error('Failed to load business health data');
    } finally {
      setLoading(false);
    }
  };

  const calculateHealthFactors = (data: any): HealthFactor[] => {
    const { profile, customers, calls, deals, integrations } = data;

    // Data Quality Factor
    const hasProfile = !!(profile?.business_name && profile?.industry);
    const hasCustomers = customers.length > 0;
    const hasCalls = calls.length > 0;
    const hasDeals = deals.length > 0;
    const hasIntegrations = integrations.length > 0;
    const dataPoints = [hasProfile, hasCustomers, hasCalls, hasDeals, hasIntegrations];
    const dataQualityScore = Math.round((dataPoints.filter(Boolean).length / dataPoints.length) * 100);

    // Operational Efficiency
    const totalTasks = customers.length + deals.length;
    const completedDeals = deals.filter((d: any) => d.stage === 'closed_won').length;
    const operationalScore = totalTasks > 0 ? Math.round((completedDeals / totalTasks) * 100) : 50;

    // Financial Health  
    const totalDealValue = deals.reduce((sum: number, deal: any) => sum + (deal.amount || 0), 0);
    const avgDealSize = deals.length > 0 ? totalDealValue / deals.length : 0;
    const financialScore = Math.min(100, Math.round((avgDealSize / 1000) * 10 + (hasProfile ? 30 : 0)));

    // Customer Success
    const qualifiedCustomers = customers.filter((c: any) => c.lead_source && c.lead_source !== 'unknown').length;
    const customerScore = customers.length > 0 ? Math.round((qualifiedCustomers / customers.length) * 100) : 0;

    // Call Performance
    const successfulCalls = calls.filter((c: any) => c.notes && !c.notes.includes('no answer')).length;
    const callScore = calls.length > 0 ? Math.round((successfulCalls / calls.length) * 100) : 0;

    // AI Intelligence
    const aiFactors = [hasProfile, hasCustomers, hasCalls, hasIntegrations];
    const aiScore = Math.round((aiFactors.filter(Boolean).length / aiFactors.length) * 100);

    return [
      {
        name: 'Data Intelligence',
        score: dataQualityScore,
        weight: 0.25,
        icon: Database,
        description: 'Quality and completeness of business data',
        status: dataQualityScore >= 80 ? 'excellent' : dataQualityScore >= 60 ? 'good' : dataQualityScore >= 40 ? 'needs-improvement' : 'critical',
        actionRequired: dataQualityScore < 70,
        route: '/data-collection'
      },
      {
        name: 'Operations',
        score: operationalScore,
        weight: 0.20,
        icon: Target,
        description: 'Operational efficiency and task completion',
        status: operationalScore >= 80 ? 'excellent' : operationalScore >= 60 ? 'good' : operationalScore >= 40 ? 'needs-improvement' : 'critical',
        actionRequired: operationalScore < 70
      },
      {
        name: 'Financial',
        score: financialScore,
        weight: 0.20,
        icon: DollarSign,
        description: 'Revenue performance and financial health',
        status: financialScore >= 80 ? 'excellent' : financialScore >= 60 ? 'good' : financialScore >= 40 ? 'needs-improvement' : 'critical',
        actionRequired: financialScore < 60,
        route: '/data-collection?section=financial'
      },
      {
        name: 'Customer Success',
        score: customerScore,
        weight: 0.15,
        icon: Users,
        description: 'Customer relationships and satisfaction',
        status: customerScore >= 80 ? 'excellent' : customerScore >= 60 ? 'good' : customerScore >= 40 ? 'needs-improvement' : 'critical',
        actionRequired: customerScore < 70,
        route: '/contacts'
      },
      {
        name: 'Call Performance',
        score: callScore,
        weight: 0.10,
        icon: Phone,
        description: 'Call quality and communication effectiveness',
        status: callScore >= 80 ? 'excellent' : callScore >= 60 ? 'good' : callScore >= 40 ? 'needs-improvement' : 'critical',
        actionRequired: callScore < 60,
        route: '/data-collection?section=calls'
      },
      {
        name: 'AI Intelligence',
        score: aiScore,
        weight: 0.10,
        icon: Brain,
        description: 'AI insights and automation potential',
        status: aiScore >= 80 ? 'excellent' : aiScore >= 60 ? 'good' : aiScore >= 40 ? 'needs-improvement' : 'critical',
        actionRequired: aiScore < 70,
        route: '/integrations'
      }
    ];
  };

  const calculateOverallHealth = (factors: HealthFactor[]): number => {
    const weightedSum = factors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0);
    return Math.round(weightedSum);
  };

  const calculateDataQuality = (data: any): number => {
    const { profile, customers, calls, deals, integrations } = data;
    const factors = [
      !!profile?.business_name,
      !!profile?.industry,
      customers.length > 0,
      calls.length > 0,
      deals.length > 0,
      integrations.length > 0
    ];
    return Math.round((factors.filter(Boolean).length / factors.length) * 100);
  };

  const determineTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
    const diff = current - previous;
    if (Math.abs(diff) < 3) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  const generateAchievements = (factors: HealthFactor[], data: any): Achievement[] => {
    const { customers, calls, deals } = data;
    
    return [
      {
        id: 'data-collector',
        title: '📊 Data Collector',
        description: 'Achieve 80% data quality score',
        icon: '📊',
        earned: factors.find(f => f.name === 'Data Intelligence')?.score >= 80 || false,
        progress: factors.find(f => f.name === 'Data Intelligence')?.score || 0,
        threshold: 80,
        rarity: 'bronze'
      },
      {
        id: 'efficiency-master',
        title: '⚡ Efficiency Master',
        description: 'Reach 90% operational efficiency',
        icon: '⚡',
        earned: factors.find(f => f.name === 'Operations')?.score >= 90 || false,
        progress: factors.find(f => f.name === 'Operations')?.score || 0,
        threshold: 90,
        rarity: 'silver'
      },
      {
        id: 'revenue-leader',
        title: '💰 Revenue Leader',
        description: 'Excel in financial performance',
        icon: '💰',
        earned: factors.find(f => f.name === 'Financial')?.score >= 85 || false,
        progress: factors.find(f => f.name === 'Financial')?.score || 0,
        threshold: 85,
        rarity: 'gold'
      },
      {
        id: 'ai-pioneer',
        title: '🤖 AI Pioneer',
        description: 'Maximize AI intelligence potential',
        icon: '🤖',
        earned: factors.find(f => f.name === 'AI Intelligence')?.score >= 95 || false,
        progress: factors.find(f => f.name === 'AI Intelligence')?.score || 0,
        threshold: 95,
        rarity: 'platinum'
      }
    ];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'needs-improvement': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'silver': return 'text-gray-600 bg-gray-50 border-gray-300';
      case 'gold': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'platinum': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 opacity-5 ${
          metrics.overall >= 80 ? 'bg-emerald-500' :
          metrics.overall >= 60 ? 'bg-blue-500' :
          metrics.overall >= 40 ? 'bg-amber-500' : 'bg-red-500'
        }`} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-6 w-6" />
                Business Health Score
              </CardTitle>
              <p className="text-muted-foreground">
                Last updated: {lastUpdate.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{metrics.overall}</div>
              <div className="flex items-center gap-2">
                {metrics.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                {metrics.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                <Badge variant={
                  metrics.overall >= 80 ? 'default' :
                  metrics.overall >= 60 ? 'secondary' :
                  metrics.overall >= 40 ? 'outline' : 'destructive'
                }>
                  {metrics.overall >= 80 ? 'Excellent' :
                   metrics.overall >= 60 ? 'Good' :
                   metrics.overall >= 40 ? 'Needs Work' : 'Critical'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={metrics.overall} className="h-3 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold">{metrics.dataQuality}%</div>
              <div className="text-muted-foreground">Data Quality</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{100 - metrics.chaosIndex}%</div>
              <div className="text-muted-foreground">Organization</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{metrics.financialHealth}%</div>
              <div className="text-muted-foreground">Financial</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{metrics.aiConfidence}%</div>
              <div className="text-muted-foreground">AI Ready</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Factors Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Health Factor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {factors.map((factor) => {
              const IconComponent = factor.icon;
              return (
                <div key={factor.name} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(factor.status)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{factor.name}</div>
                      <div className="text-sm text-muted-foreground">{factor.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-lg">{factor.score}%</div>
                      <div className="text-xs text-muted-foreground">Weight: {Math.round(factor.weight * 100)}%</div>
                    </div>
                    {factor.actionRequired && factor.route && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(factor.route!)}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Improve
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned ? getRarityColor(achievement.rarity) : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{achievement.icon}</span>
                    <span className="font-semibold">{achievement.title}</span>
                  </div>
                  {achievement.earned && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.threshold}</span>
                  </div>
                  <Progress 
                    value={Math.min(100, (achievement.progress / achievement.threshold) * 100)} 
                    className="h-2" 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions to Improve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {factors
              .filter(f => f.actionRequired)
              .slice(0, 6)
              .map((factor) => (
                <Button
                  key={factor.name}
                  variant="outline"
                  className="justify-between h-auto p-4"
                  onClick={() => factor.route && navigate(factor.route)}
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{factor.name}</div>
                    <div className="text-xs text-muted-foreground">+{Math.round((100 - factor.score) * factor.weight)} pts</div>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessHealthScore;