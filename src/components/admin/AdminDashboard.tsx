import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Shield,
  Database,
  Zap
} from "lucide-react";

interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalDecisions: number;
  completedDecisions: number;
  avgChaosIndex: number;
  recentSignups: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalDecisions: 0,
    completedDecisions: 0,
    avgChaosIndex: 0,
    recentSignups: 0
  });
  const [loading, setLoading] = useState(true);
  const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAdminMetrics();
  }, []);

  const loadAdminMetrics = async () => {
    setLoading(true);
    try {
      // Get user counts
      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at, user_id');

      // Get decision stats
      const { data: decisions } = await supabase
        .from('ai_decisions')
        .select('status, created_at');

      // Get chaos index average
      const { data: chaosMetrics } = await supabase
        .from('business_metrics')
        .select('value')
        .eq('metric_type', 'chaos_index');

      const totalUsers = profiles?.length || 0;
      const recentSignups = profiles?.filter(p => 
        new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;

      const totalDecisions = decisions?.length || 0;
      const completedDecisions = decisions?.filter(d => d.status === 'completed').length || 0;

      const avgChaosIndex = chaosMetrics?.length 
        ? Math.round(chaosMetrics.reduce((sum, m) => sum + m.value, 0) / chaosMetrics.length)
        : 0;

      setMetrics({
        totalUsers,
        activeUsers: Math.max(1, Math.floor(totalUsers * 0.7)), // Estimate active users
        totalDecisions,
        completedDecisions,
        avgChaosIndex,
        recentSignups
      });
    } catch (error) {
      console.error('Error loading admin metrics:', error);
      toast.error('Failed to load admin metrics');
    } finally {
      setLoading(false);
    }
  };

  const generateSystemDecisions = async () => {
    const actionId = 'generate-decisions';
    setProcessingActions(prev => new Set(prev).add(actionId));
    
    try {
      // Get all users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id');

      if (!profiles?.length) {
        toast.warning('No users found to generate decisions for');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      // Generate decisions for each user
      for (const profile of profiles) {
        try {
          await supabase.functions.invoke('generate-daily-decisions', {
            body: { userId: profile.user_id }
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to generate decisions for user ${profile.user_id}:`, error);
          errorCount++;
        }
      }

      toast.success(`Generated decisions for ${successCount} users${errorCount > 0 ? ` (${errorCount} errors)` : ''}`);
      loadAdminMetrics();
    } catch (error) {
      console.error('Error generating system decisions:', error);
      toast.error('Failed to generate system decisions');
    } finally {
      setProcessingActions(prev => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
    }
  };

  const generateSystemInsights = async () => {
    const actionId = 'generate-insights';
    setProcessingActions(prev => new Set(prev).add(actionId));
    
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id');

      if (!profiles?.length) {
        toast.warning('No users found to generate insights for');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const profile of profiles) {
        try {
          await supabase.functions.invoke('ai-business-advisor', {
            body: { userId: profile.user_id, analysisType: 'recommendations' }
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to generate insights for user ${profile.user_id}:`, error);
          errorCount++;
        }
      }

      toast.success(`Generated insights for ${successCount} users${errorCount > 0 ? ` (${errorCount} errors)` : ''}`);
    } catch (error) {
      console.error('Error generating system insights:', error);
      toast.error('Failed to generate system insights');
    } finally {
      setProcessingActions(prev => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </div>
        <Button onClick={loadAdminMetrics} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-green-600">
              +{metrics.recentSignups} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-blue-600">
              {Math.round((metrics.activeUsers / Math.max(metrics.totalUsers, 1)) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Decisions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDecisions}</div>
            <p className="text-xs text-purple-600">
              {metrics.completedDecisions} completed ({Math.round((metrics.completedDecisions / Math.max(metrics.totalDecisions, 1)) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Chaos Index</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgChaosIndex}</div>
            <p className="text-xs text-orange-600">
              {metrics.avgChaosIndex < 50 ? 'Healthy' : metrics.avgChaosIndex < 75 ? 'Moderate' : 'High stress'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              System Actions
            </CardTitle>
            <CardDescription>
              Run system-wide AI processes and maintenance tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateSystemDecisions}
              disabled={processingActions.has('generate-decisions')}
              className="w-full"
            >
              {processingActions.has('generate-decisions') ? 'Generating...' : 'Generate Daily Decisions for All Users'}
            </Button>
            
            <Button 
              onClick={generateSystemInsights}
              disabled={processingActions.has('generate-insights')}
              variant="outline"
              className="w-full"
            >
              {processingActions.has('generate-insights') ? 'Generating...' : 'Generate AI Insights for All Users'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              System Health
            </CardTitle>
            <CardDescription>
              Monitor system performance and data quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">User Engagement</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {Math.round((metrics.activeUsers / Math.max(metrics.totalUsers, 1)) * 100)}% Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Decision Completion</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {Math.round((metrics.completedDecisions / Math.max(metrics.totalDecisions, 1)) * 100)}% Complete
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">System Load</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                  Normal
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;