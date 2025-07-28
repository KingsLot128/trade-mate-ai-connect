import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DataQualityScore {
  category: string;
  name: string;
  completeness: number;
  impact: string;
  missingFields: string[];
  benefits: string[];
}

interface DataQualityPromptProps {
  onNavigateToDataCollection?: () => void;
  showInRecommendations?: boolean;
}

const DataQualityPrompt: React.FC<DataQualityPromptProps> = ({ 
  onNavigateToDataCollection,
  showInRecommendations = false 
}) => {
  const { user } = useAuth();
  const [dataQuality, setDataQuality] = useState<DataQualityScore[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      calculateDataQuality();
    }
  }, [user]);

  const calculateDataQuality = async () => {
    try {
      setLoading(true);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      const { data: businessSettings } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      const { data: customers } = await supabase
        .from('customers')
        .select('count')
        .eq('user_id', user?.id);

      const { data: metrics } = await supabase
        .from('business_metrics')
        .select('count')
        .eq('user_id', user?.id);

      const categories = [
        {
          category: 'financial',
          name: 'Financial Data',
          requiredFields: ['monthly_revenue', 'monthly_expenses', 'pricing_strategy'],
          data: businessSettings,
          benefits: ['25% better revenue recommendations', 'Pricing optimization', 'Profit analysis'],
          impact: 'High'
        },
        {
          category: 'operational',
          name: 'Operational Data',
          requiredFields: ['avg_project_duration', 'team_size', 'biggest_time_wasters'],
          data: profile,
          benefits: ['30% efficiency improvements', 'Time management insights', 'Process optimization'],
          impact: 'High'
        },
        {
          category: 'customer',
          name: 'Customer Intelligence',
          requiredFields: ['customer_acquisition_cost', 'customer_lifetime_value', 'preferred_communication'],
          data: profile,
          benefits: ['Personalized strategies', '40% better retention', 'Customer journey optimization'],
          impact: 'Medium'
        },
        {
          category: 'calling',
          name: 'Call Intelligence',
          requiredFields: ['daily_call_volume', 'call_duration_avg', 'conversion_rate'],
          data: profile,
          benefits: ['AI call handling', 'Voice insights', 'Call optimization'],
          impact: 'Medium'
        }
      ];

      const qualityScores = categories.map(cat => {
        const filledFields = cat.requiredFields.filter(field => 
          cat.data?.[field] && cat.data[field] !== ''
        );
        
        const completeness = Math.round((filledFields.length / cat.requiredFields.length) * 100);
        const missingFields = cat.requiredFields.filter(field => 
          !cat.data?.[field] || cat.data[field] === ''
        );

        return {
          category: cat.category,
          name: cat.name,
          completeness,
          impact: cat.impact,
          missingFields,
          benefits: cat.benefits
        };
      });

      setDataQuality(qualityScores);
      
      const avgScore = qualityScores.reduce((sum, score) => sum + score.completeness, 0) / qualityScores.length;
      setOverallScore(Math.round(avgScore));

    } catch (error) {
      console.error('Error calculating data quality:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 50) return 'secondary';
    return 'destructive';
  };

  const incompleteCategories = dataQuality.filter(cat => cat.completeness < 80);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }

  if (overallScore >= 80) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">Excellent Data Quality!</h3>
              <p className="text-sm text-green-700">
                Your data completeness of {overallScore}% enables our best insights and recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${showInRecommendations ? 'border-yellow-200 bg-yellow-50' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className={`h-6 w-6 ${overallScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`} />
            <div>
              <CardTitle className="text-lg">Data Quality Score</CardTitle>
              <CardDescription>
                Better data = Better insights and recommendations
              </CardDescription>
            </div>
          </div>
          <Badge variant={getScoreBadgeVariant(overallScore)} className="text-lg px-3 py-1">
            {overallScore}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Data Completeness</span>
            <span className={`text-sm font-medium ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
          </div>
          <Progress value={overallScore} className="h-2" />
        </div>

        {overallScore < 80 && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start space-x-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Unlock Better Insights</h4>
                <p className="text-sm text-muted-foreground">
                  Providing more business data will significantly improve your recommendations
                </p>
              </div>
            </div>

            {incompleteCategories.slice(0, 2).map((category) => (
              <div key={category.category} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{category.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {category.completeness}% complete
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Missing: {category.missingFields.join(', ').replace(/_/g, ' ')}
                </div>
                <div className="text-xs">
                  <span className="font-medium text-green-700">Benefits: </span>
                  {category.benefits.slice(0, 2).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => window.location.href = '/data-collection'}
            className="flex items-center space-x-2"
          >
            <Zap className="h-4 w-4" />
            <span>Improve Data Quality</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          {overallScore < 50 && (
            <div className="text-xs text-muted-foreground">
              <Target className="h-3 w-3 inline mr-1" />
              Goal: 80%+ for best insights
            </div>
          )}
        </div>

        {showInRecommendations && overallScore < 60 && (
          <div className="border-t pt-3 mt-3">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Current recommendations are based on limited data. 
              Provide more business details to unlock personalized, high-impact suggestions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataQualityPrompt;