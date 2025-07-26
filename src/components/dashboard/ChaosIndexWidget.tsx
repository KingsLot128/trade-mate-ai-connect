import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Target,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface ChaosData {
  score: number;
  contributors: Array<{
    category: string;
    impact: number;
    description: string;
  }>;
  recommendations: string[];
  trend: 'improving' | 'stable' | 'worsening';
}

export const ChaosIndexWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chaosData, setChaosData] = useState<ChaosData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChaosData = async () => {
      if (!user) return;

      try {
        // Get chaos score from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('chaos_score, biggest_challenge, daily_overwhelm_score')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          const chaosAnalysis = analyzeChaosScore(profile);
          setChaosData(chaosAnalysis);
        }
      } catch (error) {
        console.error('Error loading chaos data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChaosData();
  }, [user]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chaosData) return null;

  const chaosLevel = getChaosLevel(chaosData.score);
  const organizationScore = 100 - chaosData.score;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${chaosLevel.bgColor}`}>
            <chaosLevel.icon className={`h-5 w-5 ${chaosLevel.iconColor}`} />
          </div>
          <div>
            <div className="text-lg font-bold">Chaos Index</div>
            <div className="text-sm text-muted-foreground">
              Organization Score: {organizationScore}%
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Chaos Score Visualization */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Chaos Level</span>
            <span className={`text-sm font-bold ${chaosLevel.textColor}`}>
              {chaosLevel.label}
            </span>
          </div>
          
          <div className="relative">
            <Progress 
              value={chaosData.score} 
              className="h-3"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">
                {chaosData.score}%
              </span>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Organized</span>
            <span>Moderate</span>
            <span>Chaotic</span>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Top Chaos Contributors</h4>
          <div className="space-y-2">
            {chaosData.contributors.slice(0, 3).map((contributor, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div className="flex-1">
                  <div className="text-sm font-medium">{contributor.category}</div>
                  <div className="text-xs text-muted-foreground">{contributor.description}</div>
                </div>
                <div className="text-sm font-bold text-destructive">
                  +{contributor.impact}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Quick Wins</h4>
          <div className="space-y-2">
            {chaosData.recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/clarity')}
            className="flex-1"
            variant={chaosData.score > 70 ? 'default' : 'outline'}
          >
            <Zap className="h-4 w-4 mr-2" />
            Use ClarityLens
          </Button>
          <Button 
            onClick={() => navigate('/feed')}
            variant="outline"
            size="icon"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-center pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${
              chaosData.trend === 'improving' ? 'bg-success' :
              chaosData.trend === 'worsening' ? 'bg-destructive' :
              'bg-warning'
            }`}></div>
            <span>
              {chaosData.trend === 'improving' ? 'Improving' :
               chaosData.trend === 'worsening' ? 'Needs attention' :
               'Stable'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper Functions
const getChaosLevel = (score: number) => {
  if (score <= 30) {
    return {
      label: 'Organized',
      icon: CheckCircle2,
      iconColor: 'text-success',
      textColor: 'text-success',
      bgColor: 'bg-success/10'
    };
  } else if (score <= 60) {
    return {
      label: 'Moderate',
      icon: Clock,
      iconColor: 'text-warning',
      textColor: 'text-warning',
      bgColor: 'bg-warning/10'
    };
  } else {
    return {
      label: 'High Chaos',
      icon: AlertCircle,
      iconColor: 'text-destructive',
      textColor: 'text-destructive',
      bgColor: 'bg-destructive/10'
    };
  }
};

const analyzeChaosScore = (profile: any): ChaosData => {
  const chaosScore = profile?.chaos_score || 50;
  const challenge = profile?.biggest_challenge;
  const overwhelmScore = profile?.daily_overwhelm_score || 50;

  // Generate contributors based on available data
  const contributors = [
    {
      category: 'Daily Overwhelm',
      impact: Math.min(25, overwhelmScore * 0.5),
      description: 'High daily stress and task overload'
    },
    {
      category: 'Process Gaps',
      impact: Math.min(20, chaosScore * 0.3),
      description: 'Missing or inconsistent business processes'
    },
    {
      category: 'Communication',
      impact: Math.min(15, chaosScore * 0.25),
      description: 'Unclear communication and coordination'
    }
  ];

  // Generate targeted recommendations
  const recommendations = [];
  if (chaosScore > 70) {
    recommendations.push('Start with one simple daily routine');
    recommendations.push('Use the ClarityLens to prioritize urgent tasks');
  } else if (chaosScore > 40) {
    recommendations.push('Establish weekly planning sessions');
    recommendations.push('Create templates for common tasks');
  } else {
    recommendations.push('Optimize existing processes');
    recommendations.push('Explore advanced automation tools');
  }

  return {
    score: chaosScore,
    contributors,
    recommendations,
    trend: chaosScore > 70 ? 'worsening' : chaosScore < 30 ? 'improving' : 'stable'
  };
};