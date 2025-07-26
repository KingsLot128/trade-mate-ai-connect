import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Settings,
  BarChart3,
  Users,
  DollarSign
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionable_steps: string[];
  potential_impact: string;
  timeframe: string;
  difficulty: string;
  success_metrics: string[];
  priority_score: number;
  confidence_score: number;
}

interface BusinessMetrics {
  healthScore: number;
  chaosScore: number;
  growthTrend: number;
  efficiency: number;
}

const SmartRecommendationEngine = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics>({
    healthScore: 0,
    chaosScore: 0,
    growthTrend: 0,
    efficiency: 0
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadExistingRecommendations();
      loadBusinessMetrics();
    }
  }, [user]);

  const loadExistingRecommendations = async () => {
    try {
      if (!user?.id) {
        console.log('No user ID available');
        return;
      }
      
      const { data, error } = await supabase
        .from('enhanced_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('priority_score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading recommendations:', error);
        return;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const formattedRecs = data.map(rec => ({
          id: rec.id || 'unknown',
          title: (rec.content as any)?.title || rec.hook || 'Untitled Recommendation',
          description: (rec.content as any)?.description || rec.reasoning || 'No description available',
          priority: rec.priority_score > 80 ? 'high' as const : 
                   rec.priority_score > 60 ? 'medium' as const : 'low' as const,
          category: rec.recommendation_type || 'general',
          actionable_steps: (rec.content as any)?.actionable_steps || ['Review this recommendation'],
          potential_impact: rec.expected_impact || 'Positive business impact',
          timeframe: (rec.content as any)?.timeframe || rec.time_to_implement || '1-2 weeks',
          difficulty: (rec.content as any)?.difficulty || 'moderate',
          success_metrics: (rec.content as any)?.success_metrics || ['ROI improvement'],
          priority_score: rec.priority_score || 50,
          confidence_score: rec.confidence_score || 50
        })).filter(rec => rec.id !== 'unknown'); // Filter out malformed records
        setRecommendations(formattedRecs);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast.error('Failed to load recommendations');
    }
  };

  const loadBusinessMetrics = async () => {
    try {
      if (!user?.id) {
        console.log('No user ID available for metrics');
        return;
      }
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('business_health_score, chaos_score')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading business metrics:', error);
        return;
      }

      if (profile) {
        setBusinessMetrics({
          healthScore: profile.business_health_score || 0,
          chaosScore: profile.chaos_score || 0,
          growthTrend: 75, // Mock data - would be calculated from metrics
          efficiency: 68   // Mock data - would be calculated from metrics
        });
      }
    } catch (error) {
      console.error('Error loading business metrics:', error);
    }
  };

  const generateSmartRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-business-advisor', {
        body: { 
          userId: user?.id, 
          analysisType: 'recommendations'
        }
      });

      if (error) throw error;

      // Reload recommendations after generation
      await loadExistingRecommendations();
      setLastGenerated(new Date().toLocaleString());
      toast.success('Smart recommendations generated!');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-business-advisor', {
        body: { 
          userId: user?.id, 
          analysisType: 'insights'
        }
      });

      if (error) throw error;

      await loadExistingRecommendations();
      toast.success('Business insights generated!');
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return <TrendingUp className="h-4 w-4" />;
      case 'marketing': return <Target className="h-4 w-4" />;
      case 'operations': return <Settings className="h-4 w-4" />;
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'customer_service': return <Users className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'challenging': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center">
            <Brain className="h-8 w-8 mr-3 text-primary" />
            Smart Recommendation Engine
          </h2>
          <p className="text-muted-foreground text-lg">
            AI-powered insights tailored to your business success
          </p>
          {lastGenerated && (
            <p className="text-sm text-muted-foreground">Last updated: {lastGenerated}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={generateInsights} 
            disabled={loading}
            variant="outline"
          >
            <BarChart3 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Generate Insights
          </Button>
          <Button 
            onClick={generateSmartRecommendations} 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing...' : 'Smart Analysis'}
          </Button>
        </div>
      </div>

      {/* Business Health Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Health Score</p>
                <p className="text-2xl font-bold">{businessMetrics.healthScore}/100</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={businessMetrics.healthScore} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chaos Score</p>
                <p className="text-2xl font-bold">{businessMetrics.chaosScore}/100</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <Progress value={100 - businessMetrics.chaosScore} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth Trend</p>
                <p className="text-2xl font-bold">{businessMetrics.growthTrend}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={businessMetrics.growthTrend} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold">{businessMetrics.efficiency}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <Progress value={businessMetrics.efficiency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommendations">Smart Recommendations</TabsTrigger>
          <TabsTrigger value="implementation">Implementation Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && recommendations.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Generate Your Smart Recommendations</h3>
                <p className="text-muted-foreground text-center mb-4 max-w-md">
                  Our AI will analyze your business data to provide intelligent, actionable recommendations 
                  tailored to your specific situation and goals.
                </p>
                <Button onClick={generateSmartRecommendations}>
                  Start AI Analysis
                </Button>
              </CardContent>
            </Card>
          )}

          {!loading && Array.isArray(recommendations) && recommendations.length > 0 && recommendations.map((rec) => (
            <Card key={rec.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getCategoryIcon(rec.category || 'general')}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{rec.title || 'Untitled'}</CardTitle>
                      <CardDescription className="mt-1">{rec.description || 'No description'}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getPriorityColor(rec.priority || 'low')}>
                      {(rec.priority || 'low').toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {rec.category || 'general'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                      </div>
                      <p className="text-sm font-medium">{rec.timeframe || '1-2 weeks'}</p>
                      <p className="text-xs text-muted-foreground">Timeline</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Target className={`h-4 w-4 mr-1 ${getDifficultyColor(rec.difficulty || 'moderate')}`} />
                      </div>
                      <p className="text-sm font-medium capitalize">{rec.difficulty || 'moderate'}</p>
                      <p className="text-xs text-muted-foreground">Difficulty</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                      </div>
                      <p className="text-sm font-medium">{rec.confidence_score || 50}%</p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>

                  {/* Action Steps */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Action Steps:
                    </h4>
                    <ul className="space-y-2">
                      {Array.isArray(rec.actionable_steps) && rec.actionable_steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start text-sm">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                            {stepIndex + 1}
                          </span>
                          <span className="flex-1">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Success Metrics */}
                  {Array.isArray(rec.success_metrics) && rec.success_metrics.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                        Success Metrics:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(rec.success_metrics) && rec.success_metrics.map((metric, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Potential Impact */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-sm text-green-800 mb-1 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Expected Impact:
                    </h4>
                    <p className="text-sm text-green-700">{rec.potential_impact || 'Positive impact expected'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="implementation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Implementation Roadmap
              </CardTitle>
              <CardDescription>
                Prioritized action plan based on your business needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations
                  .filter(rec => rec.priority === 'high')
                  .slice(0, 3)
                  .map((rec, index) => (
                    <div key={rec.id} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.timeframe} • {rec.difficulty} difficulty</p>
                        <p className="text-sm mt-1">{rec.potential_impact}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartRecommendationEngine;