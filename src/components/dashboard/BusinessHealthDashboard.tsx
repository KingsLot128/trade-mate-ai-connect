import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Target,
  Users,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BusinessMetrics {
  healthScore: number;
  chaosScore: number;
  profileCompleteness: number;
  revenueGrowth: number;
  customerSatisfaction: number;
  operationalEfficiency: number;
}

interface HealthInsight {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export const BusinessHealthDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBusinessHealth = async () => {
      if (!user) return;

      try {
        // Fetch comprehensive business metrics
        const [profileData, metricsData, unifiedProfile] = await Promise.all([
          supabase
            .from('profiles')
            .select('business_health_score, chaos_score')
            .eq('user_id', user.id)
            .single(),
            
          supabase
            .from('business_metrics')
            .select('metric_type, value, context')
            .eq('user_id', user.id)
            .order('recorded_at', { ascending: false }),
            
          supabase
            .from('unified_business_profiles')
            .select('profile_completeness, intelligence_score')
            .eq('user_id', user.id)
            .single()
        ]);

        // Calculate comprehensive metrics
        const healthMetrics = calculateBusinessMetrics(
          profileData.data,
          metricsData.data || [],
          unifiedProfile.data
        );

        setMetrics(healthMetrics);
        setInsights(generateHealthInsights(healthMetrics));
      } catch (error) {
        console.error('Error loading business health:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBusinessHealth();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthMetricCard
          title="Business Health"
          value={metrics.healthScore}
          icon={Activity}
          color="primary"
          trend={metrics.healthScore >= 70 ? 'up' : 'down'}
        />
        <HealthMetricCard
          title="Chaos Index"
          value={100 - metrics.chaosScore}
          icon={Target}
          color={metrics.chaosScore > 70 ? 'destructive' : 'success'}
          trend={metrics.chaosScore <= 50 ? 'up' : 'down'}
        />
        <HealthMetricCard
          title="Profile Complete"
          value={metrics.profileCompleteness}
          icon={CheckCircle}
          color="secondary"
          trend="stable"
        />
        <HealthMetricCard
          title="Efficiency Score"
          value={metrics.operationalEfficiency}
          icon={TrendingUp}
          color="accent"
          trend="up"
        />
      </div>

      {/* Detailed Health Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Health Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <HealthProgressBar
              label="Revenue Growth"
              value={metrics.revenueGrowth}
              target={100}
              color="primary"
            />
            <HealthProgressBar
              label="Customer Satisfaction"
              value={metrics.customerSatisfaction}
              target={100}
              color="success"
            />
            <HealthProgressBar
              label="Operational Efficiency"
              value={metrics.operationalEfficiency}
              target={100}
              color="accent"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.slice(0, 3).map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
            {insights.length > 3 && (
              <Button variant="outline" size="sm" className="w-full">
                View All {insights.length} Insights
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights
              .filter(i => i.priority === 'urgent' || i.priority === 'high')
              .slice(0, 3)
              .map((insight, index) => (
                <ActionCard key={index} insight={insight} />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper Components
interface HealthMetricCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

const HealthMetricCard = ({ title, value, icon: Icon, color, trend }: HealthMetricCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}%</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}/10`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
      </div>
      <div className="flex items-center mt-4">
        {trend === 'up' && <TrendingUp className="h-4 w-4 text-success mr-1" />}
        {trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive mr-1" />}
        <span className={`text-sm ${
          trend === 'up' ? 'text-success' : 
          trend === 'down' ? 'text-destructive' : 
          'text-muted-foreground'
        }`}>
          {trend === 'up' ? 'Improving' : trend === 'down' ? 'Needs attention' : 'Stable'}
        </span>
      </div>
    </CardContent>
  </Card>
);

interface HealthProgressBarProps {
  label: string;
  value: number;
  target: number;
  color: string;
}

const HealthProgressBar = ({ label, value, target, color }: HealthProgressBarProps) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">{value}% of {target}%</span>
    </div>
    <Progress value={Math.min(100, (value / target) * 100)} className="h-2" />
  </div>
);

const InsightCard = ({ insight }: { insight: HealthInsight }) => {
  const priorityColors = {
    low: 'secondary' as const,
    medium: 'outline' as const,
    high: 'default' as const,
    urgent: 'destructive' as const
  };

  return (
    <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{insight.category}</span>
          <Badge variant={priorityColors[insight.priority]} className="text-xs">
            {insight.priority}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{insight.recommendation}</p>
      </div>
      <div className="text-right">
        <span className="text-lg font-bold">{insight.score}%</span>
      </div>
    </div>
  );
};

const ActionCard = ({ insight }: { insight: HealthInsight }) => (
  <Card className="p-4">
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Badge variant={insight.priority === 'urgent' ? 'destructive' : 'default'}>
          {insight.category}
        </Badge>
        <span className="text-sm font-medium">{insight.score}%</span>
      </div>
      <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
      <Button size="sm" variant="outline" className="w-full">
        Take Action
      </Button>
    </div>
  </Card>
);

// Helper Functions
const calculateBusinessMetrics = (profile: any, metrics: any[], unifiedProfile: any): BusinessMetrics => {
  const healthScore = profile?.business_health_score || 0;
  const chaosScore = profile?.chaos_score || 100;
  const profileCompleteness = unifiedProfile?.profile_completeness || 0;

  // Calculate derived metrics from available data
  const revenueGrowth = Math.min(100, profileCompleteness * 0.8 + (100 - chaosScore) * 0.2);
  const customerSatisfaction = Math.min(100, healthScore * 0.7 + profileCompleteness * 0.3);
  const operationalEfficiency = Math.min(100, (100 - chaosScore) * 0.6 + healthScore * 0.4);

  return {
    healthScore,
    chaosScore,
    profileCompleteness,
    revenueGrowth,
    customerSatisfaction,
    operationalEfficiency
  };
};

const generateHealthInsights = (metrics: BusinessMetrics): HealthInsight[] => {
  const insights: HealthInsight[] = [];

  if (metrics.chaosScore > 70) {
    insights.push({
      category: 'Operations',
      score: 100 - metrics.chaosScore,
      trend: 'down',
      recommendation: 'High chaos detected. Use ClarityLens to organize priorities and reduce overwhelm.',
      priority: 'urgent'
    });
  }

  if (metrics.profileCompleteness < 60) {
    insights.push({
      category: 'Setup',
      score: metrics.profileCompleteness,
      trend: 'stable',
      recommendation: 'Complete your business profile to unlock personalized insights and recommendations.',
      priority: 'high'
    });
  }

  if (metrics.operationalEfficiency < 70) {
    insights.push({
      category: 'Efficiency',
      score: metrics.operationalEfficiency,
      trend: 'down',
      recommendation: 'Streamline workflows and connect business tools to improve operational efficiency.',
      priority: 'medium'
    });
  }

  return insights;
};