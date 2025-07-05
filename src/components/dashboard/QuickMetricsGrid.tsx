import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar,
  Target,
  Activity,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface QuickMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

export const QuickMetricsGrid = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<QuickMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuickMetrics = async () => {
      if (!user) return;

      try {
        // Fetch various data points for metrics calculation
        const [profile, unifiedProfile, recentMetrics, integrations] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single(),
            
          supabase
            .from('unified_business_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single(),
            
          supabase
            .from('business_metrics')
            .select('*')
            .eq('user_id', user.id)
            .order('recorded_at', { ascending: false })
            .limit(20),
            
          supabase
            .from('integrations')
            .select('provider, is_active')
            .eq('user_id', user.id)
            .eq('is_active', true)
        ]);

        const calculatedMetrics = calculateQuickMetrics({
          profile: profile.data,
          unifiedProfile: unifiedProfile.data,
          recentMetrics: recentMetrics.data || [],
          integrations: integrations.data || []
        });

        setMetrics(calculatedMetrics);
      } catch (error) {
        console.error('Error loading quick metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuickMetrics();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <QuickMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};

interface QuickMetricCardProps {
  metric: QuickMetric;
}

const QuickMetricCard = ({ metric }: QuickMetricCardProps) => {
  const { title, value, change, trend, icon: Icon, color, priority } = metric;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg bg-${color}/10`}>
            <Icon className={`h-4 w-4 text-${color}`} />
          </div>
          {priority === 'high' && (
            <Badge variant="destructive" className="text-xs">
              !
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
          <p className="text-lg font-bold">{value}</p>
          
          <div className="flex items-center gap-1">
            {trend === 'up' && <TrendingUp className="h-3 w-3 text-success" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3 text-destructive" />}
            <span className={`text-xs ${
              trend === 'up' ? 'text-success' : 
              trend === 'down' ? 'text-destructive' : 
              'text-muted-foreground'
            }`}>
              {change}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate metrics
const calculateQuickMetrics = (data: any): QuickMetric[] => {
  const { profile, unifiedProfile, recentMetrics, integrations } = data;
  
  const healthScore = profile?.business_health_score || 0;
  const chaosScore = profile?.chaos_score || 100;
  const completeness = unifiedProfile?.profile_completeness || 0;
  const intelligenceScore = unifiedProfile?.intelligence_score || 0;

  return [
    {
      id: 'health',
      title: 'Business Health',
      value: `${healthScore}%`,
      change: healthScore >= 70 ? '+5%' : 'Needs focus',
      trend: healthScore >= 70 ? 'up' : 'down',
      icon: Activity,
      color: 'primary',
      priority: healthScore < 50 ? 'high' : 'medium'
    },
    {
      id: 'chaos',
      title: 'Organization',
      value: `${100 - chaosScore}%`,
      change: chaosScore <= 50 ? 'Good' : 'Review needed',
      trend: chaosScore <= 50 ? 'up' : 'down',
      icon: Target,
      color: chaosScore > 70 ? 'destructive' : 'success',
      priority: chaosScore > 80 ? 'high' : 'medium'
    },
    {
      id: 'profile',
      title: 'Profile Setup',
      value: `${completeness}%`,
      change: completeness >= 80 ? 'Complete' : `${100 - completeness}% left`,
      trend: completeness >= 80 ? 'up' : 'stable',
      icon: Users,
      color: 'secondary',
      priority: completeness < 60 ? 'high' : 'low'
    },
    {
      id: 'intelligence',
      title: 'AI Intelligence',
      value: `${intelligenceScore}%`,
      change: intelligenceScore >= 60 ? 'Active' : 'Building',
      trend: intelligenceScore >= 60 ? 'up' : 'stable',
      icon: Star,
      color: 'accent',
      priority: 'medium'
    },
    {
      id: 'integrations',
      title: 'Connected Tools',
      value: `${integrations.length}`,
      change: integrations.length > 0 ? 'Connected' : 'None',
      trend: integrations.length > 0 ? 'up' : 'stable',
      icon: Activity,
      color: 'primary',
      priority: integrations.length === 0 ? 'medium' : 'low'
    },
    {
      id: 'efficiency',
      title: 'Efficiency Score',
      value: `${Math.min(100, (100 - chaosScore) * 0.7 + completeness * 0.3)}%`,
      change: '+2% this week',
      trend: 'up',
      icon: TrendingUp,
      color: 'success',
      priority: 'medium'
    },
    {
      id: 'revenue',
      title: 'Revenue Health',
      value: profile?.target_revenue || 'Not set',
      change: 'Target set',
      trend: 'stable',
      icon: DollarSign,
      color: 'primary',
      priority: !profile?.target_revenue ? 'medium' : 'low'
    },
    {
      id: 'goals',
      title: 'Goals Progress',
      value: profile?.business_goals ? '3 active' : 'Set goals',
      change: 'In progress',
      trend: 'stable',
      icon: Calendar,
      color: 'secondary',
      priority: !profile?.business_goals ? 'medium' : 'low'
    }
  ];
};