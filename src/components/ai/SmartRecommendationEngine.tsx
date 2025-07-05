import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Star,
  BarChart3,
  Brain
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateAdaptiveRecommendations, getUserBehavior, getIndustryBenchmarks } from '@/utils/adaptiveRecommendations';
import { synthesizeBusinessData } from '@/utils/dataUnification';
import { initializeTracking, trackRecommendationView, trackRecommendationImplemented } from '@/utils/dataTracking';

interface SmartRecommendation {
  id: string;
  type: 'revenue' | 'efficiency' | 'growth' | 'operational' | 'strategic';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  hook: string;
  title: string;
  description: string;
  reasoning: string;
  expectedImpact: string;
  timeToImplement: string;
  personalizedScore: number;
  confidenceScore: number;
  urgencyScore: number;
  actions: string[];
  streamType: string;
}

export const SmartRecommendationEngine = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'urgent' | 'revenue' | 'efficiency'>('all');

  useEffect(() => {
    const loadSmartRecommendations = async () => {
      if (!user) return;

      try {
        // Initialize tracking for this user
        initializeTracking(user.id);

        // Get existing recommendations from database
        const { data: existingRecs } = await supabase
          .from('enhanced_recommendations')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (existingRecs && existingRecs.length > 0) {
          // Transform database recommendations to component format
          const transformedRecs = existingRecs.map(rec => {
            const content = rec.content as any;
            return {
              id: rec.recommendation_id,
              type: rec.recommendation_type as any,
              priority: (rec.priority_score > 80 ? 'urgent' : rec.priority_score > 60 ? 'high' : 'medium') as 'high' | 'medium' | 'low' | 'urgent',
              hook: rec.hook,
              title: content?.title || 'Recommendation',
              description: content?.description || 'AI-generated recommendation',
              reasoning: rec.reasoning,
              expectedImpact: content?.expectedImpact || 'Positive impact expected',
              timeToImplement: content?.timeToImplement || '1-2 weeks',
              personalizedScore: rec.personalized_score || 75,
              confidenceScore: rec.confidence_score || 80,
              urgencyScore: rec.priority_score || 70,
              actions: content?.actions || [],
              streamType: rec.stream_type || 'forYou'
            };
          });
          setRecommendations(transformedRecs);
        } else {
          // Generate new recommendations using the adaptive engine
          await generateNewRecommendations();
        }
      } catch (error) {
        console.error('Error loading smart recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSmartRecommendations();
  }, [user]);

  const generateNewRecommendations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Synthesize all business data
      const unifiedProfile = await synthesizeBusinessData(user.id);
      
      // Get user behavior patterns
      const userBehavior = await getUserBehavior(user.id);
      
      // Get industry benchmarks
      const industryBenchmarks = getIndustryBenchmarks(unifiedProfile.businessInfo.industry);
      
      // Generate adaptive recommendations
      const newRecommendations = await generateAdaptiveRecommendations(user.id, {
        unifiedProfile,
        userBehavior,
        industryBenchmarks
      });

      // Transform to component format
      const transformedRecs = newRecommendations.map(rec => ({
        id: rec.id,
        type: rec.type,
        priority: rec.priority,
        hook: rec.hook,
        title: rec.title,
        description: rec.description,
        reasoning: rec.reasoning,
        expectedImpact: rec.expectedImpact,
        timeToImplement: rec.timeToImplement,
        personalizedScore: rec.personalizedScore,
        confidenceScore: rec.confidenceScore,
        urgencyScore: rec.urgencyScore,
        actions: rec.actions,
        streamType: rec.streamType || 'forYou'
      }));

      setRecommendations(transformedRecs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationView = (recommendation: SmartRecommendation) => {
    trackRecommendationView(recommendation.id, {
      type: recommendation.type,
      priority: recommendation.priority,
      personalized_score: recommendation.personalizedScore
    });
  };

  const handleImplementAction = async (recommendation: SmartRecommendation) => {
    await trackRecommendationImplemented(
      recommendation.id, 
      'user_marked_implemented', 
      recommendation.personalizedScore
    );
    
    // Update local state to show as implemented
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === recommendation.id 
          ? { ...rec, implemented: true } 
          : rec
      )
    );
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'urgent') return rec.priority === 'urgent';
    return rec.type === selectedFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue': return TrendingUp;
      case 'efficiency': return Target;
      case 'growth': return BarChart3;
      case 'operational': return Zap;
      case 'strategic': return Star;
      default: return Brain;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Smart Recommendations</h2>
            <p className="text-muted-foreground">
              AI-powered, personalized business recommendations
            </p>
          </div>
        </div>
        <Button onClick={generateNewRecommendations} disabled={loading}>
          <Zap className="h-4 w-4 mr-2" />
          Refresh Recommendations
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All Recommendations' },
          { key: 'urgent', label: 'Urgent' },
          { key: 'revenue', label: 'Revenue' },
          { key: 'efficiency', label: 'Efficiency' }
        ].map(filter => (
          <Button
            key={filter.key}
            variant={selectedFilter === filter.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(filter.key as any)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="space-y-4">
        {filteredRecommendations.map((recommendation) => (
          <SmartRecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onView={() => handleRecommendationView(recommendation)}
            onImplement={() => handleImplementAction(recommendation)}
          />
        ))}
        
        {filteredRecommendations.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Recommendations Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or generate new recommendations
              </p>
              <Button onClick={generateNewRecommendations}>
                <Zap className="h-4 w-4 mr-2" />
                Generate Recommendations
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Individual Recommendation Card
interface SmartRecommendationCardProps {
  recommendation: SmartRecommendation & { implemented?: boolean };
  onView: () => void;
  onImplement: () => void;
}

const SmartRecommendationCard = ({ 
  recommendation, 
  onView, 
  onImplement 
}: SmartRecommendationCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [viewed, setViewed] = useState(false);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue': return TrendingUp;
      case 'efficiency': return Target;
      case 'growth': return BarChart3;
      case 'operational': return Zap;
      case 'strategic': return Star;
      default: return Brain;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const TypeIcon = getTypeIcon(recommendation.type);
  
  const handleExpand = () => {
    if (!viewed) {
      onView();
      setViewed(true);
    }
    setExpanded(!expanded);
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-200 ${
      recommendation.priority === 'urgent' ? 'border-destructive' : ''
    }`}>
      {/* Priority indicator */}
      {recommendation.priority === 'urgent' && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-destructive">
          <div className="absolute -top-8 -right-1 text-destructive-foreground text-xs font-bold transform rotate-45">
            URGENT
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={getPriorityColor(recommendation.priority) as any}>
                  {recommendation.priority}
                </Badge>
                <Badge variant="outline">{recommendation.type}</Badge>
              </div>
              <CardTitle className="text-lg mb-2">{recommendation.title}</CardTitle>
              <div className="text-sm text-primary font-medium mb-2">
                {recommendation.hook}
              </div>
              <p className="text-muted-foreground">{recommendation.description}</p>
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xs text-muted-foreground">Match Score</div>
              <div className="text-lg font-bold text-primary">
                {recommendation.personalizedScore}%
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <Clock className="h-3 w-3 inline mr-1" />
              {recommendation.timeToImplement}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Indicators */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span>Confidence</span>
              <span>{recommendation.confidenceScore}%</span>
            </div>
            <Progress value={recommendation.confidenceScore} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span>Urgency</span>
              <span>{recommendation.urgencyScore}%</span>
            </div>
            <Progress value={recommendation.urgencyScore} className="h-2" />
          </div>
        </div>

        {/* Expected Impact */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="font-medium text-sm mb-1">Expected Impact</div>
          <div className="text-sm text-muted-foreground">{recommendation.expectedImpact}</div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h4 className="font-medium mb-2">AI Reasoning</h4>
              <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Action Steps</h4>
              <ul className="space-y-2">
                {recommendation.actions.map((action, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExpand}
          >
            {expanded ? 'Show Less' : 'Show Details'}
            <ArrowRight className={`h-4 w-4 ml-2 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </Button>
          
          <div className="flex gap-2">
            {!recommendation.implemented && (
              <Button size="sm" onClick={onImplement}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Implement
              </Button>
            )}
            {recommendation.implemented && (
              <Badge variant="secondary">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Implemented
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};