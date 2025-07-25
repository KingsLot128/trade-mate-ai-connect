import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  RefreshCw, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb,
  BarChart3,
  Target,
  Clock
} from "lucide-react";

interface BusinessInsight {
  id: string;
  insight_type: string;
  title: string;
  description: string;
  confidence_score: number;
  impact_estimation: string;
  data_source: string;
  created_at: string;
}

const AIInsightsPreview = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      loadInsights();
    }
  }, [user]);

  const loadInsights = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('business_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setInsights((data || []) as any); // Type assertion for compatibility
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewInsights = async () => {
    if (!user || generating) return;
    
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-business-advisor', {
        body: { userId: user.id, analysisType: 'recommendations' }
      });

      if (error) throw error;
      
      toast.success('New AI insights generated!');
      await loadInsights();
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'revenue_trend': return TrendingUp;
      case 'efficiency_opportunity': return Target;
      case 'risk_alert': return AlertCircle;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'revenue_trend': return 'text-green-600 bg-green-50 border-green-200';
      case 'efficiency_opportunity': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'risk_alert': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-purple-600 bg-purple-50 border-purple-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            AI Business Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            AI Business Insights
          </CardTitle>
          <Button 
            onClick={generateNewInsights}
            disabled={generating}
            size="sm"
            variant="outline"
          >
            {generating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
        <CardDescription>
          AI-powered insights based on your business data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No insights yet</h3>
            <p className="text-gray-600 mb-4">Generate your first AI business insights</p>
            <Button onClick={generateNewInsights} disabled={generating}>
              {generating ? 'Generating...' : 'Generate Insights'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.slice(0, 3).map((insight) => {
              const Icon = getInsightIcon(insight.insight_type);
              const colorClass = getInsightColor(insight.insight_type);
              
              return (
                <div 
                  key={insight.id} 
                  className={`p-4 rounded-lg border ${colorClass}`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-sm opacity-90 mb-2">
                        {insight.description.length > 120 
                          ? `${insight.description.substring(0, 120)}...`
                          : insight.description
                        }
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(insight.confidence_score * 100)}% confidence
                        </Badge>
                        <span className="opacity-75">
                          {new Date(insight.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {insights.length > 3 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm">
                  View All Insights ({insights.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsPreview;