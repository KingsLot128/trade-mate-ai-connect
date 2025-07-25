import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, RefreshCw, TrendingUp, Target, AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DecisionCard from './DecisionCard';

interface Decision {
  id: string;
  decision_type: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  time_to_implement: string;
  estimated_value: string;
  reasoning: string;
  priority: number;
  status: string;
  created_at: string;
}

const DecisionFeed: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });

  useEffect(() => {
    if (user) {
      loadDecisions();
    }
  }, [user]);

  const loadDecisions = async () => {
    if (!user) return;

    try {
      // Load today's decisions
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('ai_decisions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today + 'T00:00:00')
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDecisions((data || []) as any); // Type assertion for compatibility

      // Calculate stats
      const total = data?.length || 0;
      const completed = data?.filter(d => d.status === 'completed').length || 0;
      const pending = data?.filter(d => d.status === 'pending').length || 0;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({ total, completed, pending, completionRate });

    } catch (error) {
      console.error('Error loading decisions:', error);
      toast({
        title: "Error",
        description: "Failed to load your decision feed.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNewDecisions = async () => {
    if (!user) return;

    setGenerating(true);
    try {
      const { error } = await supabase.functions.invoke('generate-daily-decisions', {
        body: { userId: user.id }
      });

      if (error) throw error;

      await loadDecisions();
      
      toast({
        title: "Fresh insights generated! 🧠",
        description: "Your daily decision feed has been updated with new AI recommendations.",
      });

    } catch (error) {
      console.error('Error generating decisions:', error);
      toast({
        title: "Error",
        description: "Failed to generate new decisions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDecisionStatusChange = (decisionId: string, newStatus: string) => {
    setDecisions(prev => 
      prev.map(d => 
        d.id === decisionId 
          ? { ...d, status: newStatus }
          : d
      )
    );
    
    // Recalculate stats
    setTimeout(loadDecisions, 100);
  };

  const priorityDecisions = decisions.filter(d => d.status === 'pending' && d.impact === 'high');
  const revenueDecisions = decisions.filter(d => d.decision_type === 'revenue' && d.status === 'pending');
  const efficiencyDecisions = decisions.filter(d => d.decision_type === 'efficiency' && d.status === 'pending');

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Decision Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <Brain className="h-8 w-8 mr-3 text-primary" />
            Decision Feed
          </h2>
          <p className="text-muted-foreground">
            AI-powered daily recommendations based on your business data
          </p>
        </div>
        <Button 
          onClick={generateNewDecisions} 
          disabled={generating}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Refresh Feed'}
        </Button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Decisions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
              <Badge variant={stats.completionRate >= 50 ? "default" : "secondary"}>
                {stats.completionRate >= 50 ? "Good" : "Improve"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {decisions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No decisions yet today</h3>
            <p className="text-muted-foreground mb-4">
              Generate your personalized daily recommendations to get started.
            </p>
            <Button onClick={generateNewDecisions} disabled={generating}>
              <Brain className="h-4 w-4 mr-2" />
              Generate My Daily Feed
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Priority Actions */}
          {priorityDecisions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Today's Priority Actions
              </h3>
              <div className="grid gap-4">
                {priorityDecisions.map(decision => (
                  <DecisionCard 
                    key={decision.id} 
                    decision={decision} 
                    onStatusChange={handleDecisionStatusChange}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Revenue Opportunities */}
          {revenueDecisions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Revenue Opportunities
              </h3>
              <div className="grid gap-4">
                {revenueDecisions.map(decision => (
                  <DecisionCard 
                    key={decision.id} 
                    decision={decision} 
                    onStatusChange={handleDecisionStatusChange}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Efficiency Improvements */}
          {efficiencyDecisions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Efficiency Improvements
              </h3>
              <div className="grid gap-4">
                {efficiencyDecisions.map(decision => (
                  <DecisionCard 
                    key={decision.id} 
                    decision={decision} 
                    onStatusChange={handleDecisionStatusChange}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Other Decisions */}
          {decisions.filter(d => 
            d.status === 'pending' && 
            d.impact !== 'high' && 
            d.decision_type !== 'revenue' && 
            d.decision_type !== 'efficiency'
          ).length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Other Recommendations</h3>
              <div className="grid gap-4">
                {decisions
                  .filter(d => 
                    d.status === 'pending' && 
                    d.impact !== 'high' && 
                    d.decision_type !== 'revenue' && 
                    d.decision_type !== 'efficiency'
                  )
                  .map(decision => (
                    <DecisionCard 
                      key={decision.id} 
                      decision={decision} 
                      onStatusChange={handleDecisionStatusChange}
                    />
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DecisionFeed;