import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Target,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIInsight {
  title: string;
  category: 'Operations' | 'Revenue' | 'Growth' | 'Efficiency';
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  actions: string[];
  timeline: string;
  effort: 'low' | 'medium' | 'high';
  confidence: number;
}

interface AIRecommendation {
  id: string;
  title: string;
  type: 'revenue' | 'efficiency' | 'growth' | 'operational';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  description: string;
  expectedImpact: string;
  timeToImplement: string;
  difficulty: 'easy' | 'medium' | 'challenging';
  steps: string[];
  metrics: string[];
}

export const AIInsightsPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations' | 'predictions'>('insights');

  const generateInsights = async (type: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: {
          userId: user.id
        }
      });

      if (error) throw error;

      if (data.insights) {
        // Transform the OpenAI response to match our interface
        const transformedInsights = data.insights.map((insight: any, index: number) => ({
          title: insight.title,
          category: insight.category as 'Operations' | 'Revenue' | 'Growth' | 'Efficiency',
          priority: insight.priority as 'high' | 'medium' | 'low',
          description: insight.description,
          impact: insight.potential_impact,
          actions: insight.actionable_steps,
          timeline: '1-2 weeks',
          effort: 'medium' as 'low' | 'medium' | 'high',
          confidence: 0.85
        }));
        
        setInsights(transformedInsights);
        toast({
          title: "AI Insights Generated",
          description: `Generated ${transformedInsights.length} personalized business insights.`
        });
        
        // Also set recommendations from the same data
        const transformedRecommendations = data.insights.map((insight: any, index: number) => ({
          id: `rec-${index}`,
          title: insight.title,
          type: insight.category.toLowerCase() as 'revenue' | 'efficiency' | 'growth' | 'operational',
          priority: insight.priority as 'urgent' | 'high' | 'medium' | 'low',
          description: insight.description,
          expectedImpact: insight.potential_impact,
          timeToImplement: '1-2 weeks',
          difficulty: 'medium' as 'easy' | 'medium' | 'challenging',
          steps: insight.actionable_steps,
          metrics: ['ROI', 'Growth Rate', 'Efficiency']
        }));
        
        setRecommendations(transformedRecommendations);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate insights on component mount
  useEffect(() => {
    if (user) {
      generateInsights('insights');
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Business Intelligence</h2>
            <p className="text-muted-foreground">
              Personalized insights powered by advanced AI analysis
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'insights' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('insights')}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Insights
          </Button>
          <Button
            variant={activeTab === 'recommendations' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('recommendations')}
          >
            <Target className="h-4 w-4 mr-2" />
            Recommendations
          </Button>
          <Button
            variant={activeTab === 'predictions' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('predictions')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Predictions
          </Button>
        </div>
      </div>

      {/* Generate Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => generateInsights('insights')}
          disabled={loading}
          variant="outline"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Insights
        </Button>
        <Button
          onClick={() => generateInsights('recommendations')}
          disabled={loading}
          variant="outline"
        >
          <Target className="h-4 w-4 mr-2" />
          Get Recommendations
        </Button>
        <Button
          onClick={() => generateInsights('predictions')}
          disabled={loading}
          variant="outline"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          View Predictions
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div>
                <p className="font-medium">AI Analysis in Progress...</p>
                <p className="text-sm text-muted-foreground">
                  Analyzing your business data and generating personalized insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <AIInsightCard key={index} insight={insight} />
          ))}
          {insights.length === 0 && !loading && (
            <Card className="lg:col-span-2">
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No AI Insights Generated</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Generate Insights" to get personalized business intelligence
                </p>
                <Button onClick={() => generateInsights('insights')}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Insights
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && !loading && (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <AIRecommendationCard key={rec.id} recommendation={rec} />
          ))}
          {recommendations.length === 0 && !loading && (
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Recommendations Available</h3>
                <p className="text-muted-foreground mb-4">
                  Generate AI-powered recommendations tailored to your business
                </p>
                <Button onClick={() => generateInsights('recommendations')}>
                  <Target className="h-4 w-4 mr-2" />
                  Get Recommendations
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

// Individual Insight Card Component
const AIInsightCard = ({ insight }: { insight: AIInsight }) => {
  const [expanded, setExpanded] = useState(false);
  
  const categoryIcons = {
    Operations: Target,
    Revenue: TrendingUp,
    Growth: BarChart3,
    Efficiency: CheckCircle2
  };
  
  const priorityColors = {
    high: 'destructive',
    medium: 'default',
    low: 'secondary'
  } as const;

  const Icon = categoryIcons[insight.category];

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{insight.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={priorityColors[insight.priority]}>
                  {insight.priority} priority
                </Badge>
                <Badge variant="outline">{insight.category}</Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Confidence</div>
            <div className="font-bold">{Math.round(insight.confidence * 100)}%</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{insight.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium">Expected Impact</div>
            <div className="text-muted-foreground">{insight.impact}</div>
          </div>
          <div>
            <div className="font-medium">Timeline</div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {insight.timeline}
            </div>
          </div>
        </div>

        {expanded && (
          <div className="space-y-3 pt-3 border-t">
            <div>
              <h4 className="font-medium mb-2">Action Steps</h4>
              <ul className="space-y-1">
                {insight.actions.map((action, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 text-success flex-shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Effort Level:</span>
              <Badge variant={insight.effort === 'high' ? 'destructive' : insight.effort === 'medium' ? 'default' : 'secondary'}>
                {insight.effort}
              </Badge>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full"
        >
          {expanded ? 'Show Less' : 'Show Details'}
        </Button>
      </CardContent>
    </Card>
  );
};

// Individual Recommendation Card Component
const AIRecommendationCard = ({ recommendation }: { recommendation: AIRecommendation }) => {
  const [implemented, setImplemented] = useState(false);
  
  const typeColors = {
    revenue: 'text-success',
    efficiency: 'text-primary',
    growth: 'text-accent',
    operational: 'text-secondary'
  };

  const priorityColors = {
    urgent: 'destructive',
    high: 'default',
    medium: 'secondary',
    low: 'outline'
  } as const;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{recommendation.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={priorityColors[recommendation.priority]}>
                {recommendation.priority}
              </Badge>
              <Badge variant="outline" className={typeColors[recommendation.type]}>
                {recommendation.type}
              </Badge>
              <Badge variant="secondary">
                {recommendation.difficulty}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Timeline</div>
            <div className="font-medium">{recommendation.timeToImplement}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{recommendation.description}</p>
        
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="font-medium text-sm mb-1">Expected Impact</div>
          <div className="text-sm text-muted-foreground">{recommendation.expectedImpact}</div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Implementation Steps</h4>
          <ul className="space-y-1">
            {recommendation.steps.map((step, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => setImplemented(!implemented)}
            variant={implemented ? "secondary" : "default"}
          >
            {implemented ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Implemented
              </>
            ) : (
              'Mark as Implemented'
            )}
          </Button>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};