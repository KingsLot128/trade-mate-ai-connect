import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEngagementTracking } from '@/hooks/useEngagementTracking';

interface Recommendation {
  id: string;
  recommendation_id: string;
  content: any;
  recommendation_type: string;
  hook: string;
  estimated_read_time: number;
  expected_impact: string;
  time_to_implement: string;
  reasoning: string;
  priority_score: number;
  title?: string;
  description?: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  streamType: string;
  onEngagement: (id: string, action: string, metadata?: any) => void;
  onAction: (id: string, action: string) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  streamType,
  onEngagement, 
  onAction 
}) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [implemented, setImplemented] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const { trackEngagement, trackTimeSpent } = useEngagementTracking();

  // Time tracking
  useEffect(() => {
    if (isVisible && !startTimeRef.current) {
      startTimeRef.current = Date.now();
    } else if (!isVisible && startTimeRef.current) {
      const timeOnCard = Date.now() - startTimeRef.current;
      setTimeSpent(prev => prev + timeOnCard);
      trackTimeSpent(recommendation.recommendation_id, timeOnCard);
      startTimeRef.current = 0;
    }
  }, [isVisible, recommendation.recommendation_id, trackTimeSpent]);

  // Intersection Observer for visibility tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getPriorityColor = (priority: number) => {
    if (priority > 80) return 'bg-red-500';
    if (priority > 60) return 'bg-orange-500';
    if (priority > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTypeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'quick_win': return 'default';
      case 'strategic': return 'secondary';
      case 'trending': return 'destructive';
      default: return 'outline';
    }
  };

  const handleImplementation = async (rec: Recommendation) => {
    setImplemented(true);
    await trackEngagement(rec.recommendation_id, 'implemented');
    onAction(rec.recommendation_id, 'implement');
  };

  const handleRating = async (rating: number) => {
    await trackEngagement(recommendation.recommendation_id, 'rated', { rating });
    onEngagement(recommendation.recommendation_id, 'rated', { rating });
  };

  const title = recommendation.content?.title || recommendation.title || 'Business Recommendation';
  const description = recommendation.content?.description || recommendation.description || 'No description available';

  return (
    <Card 
      ref={cardRef}
      className="recommendation-card hover:shadow-lg transition-all duration-200 relative"
    >
      {/* Priority indicator */}
      <div className={`priority-bar h-1 ${getPriorityColor(recommendation.priority_score)}`} />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant={getTypeVariant(recommendation.recommendation_type)}>
            {recommendation.recommendation_type.toUpperCase()}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {recommendation.estimated_read_time}min read
          </div>
        </div>
        
        {/* Hook - TikTok style attention grabber */}
        <h3 className="text-lg font-bold text-primary leading-tight">
          {recommendation.hook}
        </h3>
      </CardHeader>

      <CardContent>
        <h4 className="font-semibold mb-2">{title}</h4>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        {/* Impact metrics */}
        <div className="impact-metrics grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/50 rounded">
          <div>
            <div className="text-sm text-muted-foreground">Expected Impact</div>
            <div className="font-semibold text-green-600">{recommendation.expected_impact}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Time to Implement</div>
            <div className="font-semibold">{recommendation.time_to_implement}</div>
          </div>
        </div>

        {/* AI reasoning */}
        <div className="ai-reasoning mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
          <div className="text-sm text-blue-800">
            <strong>Why now:</strong> {recommendation.reasoning}
          </div>
        </div>

        {/* Action buttons */}
        <div className="action-buttons flex space-x-2 mb-4">
          <Button 
            onClick={() => handleImplementation(recommendation)}
            className="flex-1"
            disabled={implemented}
          >
            {implemented ? 'Implemented ✓' : 'Implement Now'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onAction(recommendation.recommendation_id, 'schedule')}
          >
            Schedule
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onAction(recommendation.recommendation_id, 'dismiss')}
          >
            Not Now
          </Button>
        </div>

        {/* Quick feedback */}
        <div className="quick-feedback pt-3 border-t">
          <div className="text-sm text-muted-foreground mb-2">How relevant is this?</div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(rating => (
              <Button
                key={rating}
                variant="ghost"
                size="sm"
                onClick={() => handleRating(rating)}
                className="p-1 hover:bg-yellow-100"
              >
                ⭐
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;