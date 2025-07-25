import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowRight, Lightbulb } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Insight {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionType: string;
}

const QuickInsights: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      if (!user) return;

      try {
        // Fetch user's chaos index and quiz responses
        const { data: metrics } = await supabase
          .from('business_metrics')
          .select('*')
          .eq('user_id', user.id)
          .eq('metric_type', 'chaos_index')
          .order('recorded_at', { ascending: false })
          .limit(1);

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const chaosIndex = metrics?.[0]?.value || 0;
        
        // Generate insights based on chaos index and industry
        const generatedInsights: Insight[] = [];

        if (chaosIndex > 6) {
          generatedInsights.push({
            id: '1',
            title: 'Optimize Your Schedule',
            description: 'Your chaos index indicates scheduling challenges. Consider implementing time-blocking.',
            priority: 'high',
            actionType: 'scheduling'
          });
        }

        if (chaosIndex > 4) {
          generatedInsights.push({
            id: '2',
            title: 'Automate Follow-ups',
            description: 'Set up automated client follow-up sequences to reduce missed opportunities.',
            priority: 'medium',
            actionType: 'automation'
          });
        }

        generatedInsights.push({
          id: '3',
          title: 'Track Key Metrics',
          description: 'Monitor your business performance with our Clarity Lens dashboard.',
          priority: 'low',
          actionType: 'analytics'
        });

        setInsights(generatedInsights);
      } catch (error) {
        console.error('Error generating insights:', error);
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [user]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>Quick Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-6">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Complete the setup wizard to get personalized insights.</p>
          </div>
        ) : (
          <>
            {insights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant={getPriorityColor(insight.priority)} className="text-xs">
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Take Action <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))}
            
            <Button 
              onClick={() => navigate('/dashboard?tab=decisions')} 
              className="w-full"
              variant="outline"
            >
              Get More Insights <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickInsights;