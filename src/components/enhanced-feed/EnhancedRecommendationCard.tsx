import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface StreamContent {
  id: string;
  type: 'recommendation' | 'insight' | 'trend';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  category: string;
  streamType: string;
  engagement: {
    views: number;
    implementations: number;
    likes: number;
  };
  metadata: {
    industry?: string;
    seasonality?: string;
    peerCount?: number;
    trendingScore?: number;
  };
}

interface EnhancedRecommendationCardProps {
  content: StreamContent;
  onEngagement: (action: string) => void;
}

const EnhancedRecommendationCard: React.FC<EnhancedRecommendationCardProps> = ({ 
  content, 
  onEngagement 
}) => {
  const [implemented, setImplemented] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showImplementationGuide, setShowImplementationGuide] = useState(false);
  const [implementationProgress, setImplementationProgress] = useState(0);

  useEffect(() => {
    if (implemented) {
      // Simulate implementation progress
      const interval = setInterval(() => {
        setImplementationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Show feedback form after 24 hours (simulated as 3 seconds for demo)
            setTimeout(() => {
              setShowFeedback(true);
            }, 3000);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [implemented]);

  const handleImplementation = async () => {
    setImplemented(true);
    setShowImplementationGuide(true);
    onEngagement('implemented');
    toast.success('🚀 Implementation started! We\'ll check in with you soon.');
  };

  const handleLike = () => {
    setLiked(!liked);
    onEngagement(liked ? 'unlike' : 'like');
    if (!liked) {
      toast.success('👍 Liked! This helps us show you better content.');
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    onEngagement(saved ? 'unsave' : 'save');
    toast.success(saved ? 'Removed from saved' : '💾 Saved for later!');
  };

  const handleShare = () => {
    onEngagement('share');
    navigator.clipboard.writeText(content.title);
    toast.success('📋 Copied to clipboard!');
  };

  const handleFeedback = (impact: string, details?: string) => {
    onEngagement(`feedback_${impact}`);
    setShowFeedback(false);
    
    // Show celebration based on impact
    if (impact === 'revenue_increase') {
      toast.success('🎉 Amazing! Revenue growth is the best kind of success!');
    } else if (impact === 'time_saved') {
      toast.success('⏰ Time is money! Great to hear you\'re more efficient!');
    } else {
      toast.success('📈 Every improvement counts! Keep up the great work!');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return '💡';
      case 'insight': return '📊';
      case 'trend': return '🔥';
      default: return '💡';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      sales: 'bg-blue-100 text-blue-800',
      financial: 'bg-green-100 text-green-800',
      operational: 'bg-purple-100 text-purple-800',
      seasonal: 'bg-orange-100 text-orange-800',
      peers: 'bg-cyan-100 text-cyan-800',
      systems: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className={`enhanced-recommendation-card hover:shadow-lg transition-all duration-300 ${
      implemented ? 'border-green-300 bg-green-50/30' : ''
    } animate-fade-in hover-scale`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">{getTypeIcon(content.type)}</span>
              <Badge className={getPriorityColor(content.priority)} variant="outline">
                {content.priority}
              </Badge>
              <Badge className={getCategoryColor(content.category)} variant="outline">
                {content.category}
              </Badge>
              {content.metadata.trendingScore && content.metadata.trendingScore > 85 && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  🔥 Trending
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{content.description}</p>

        {/* Implementation Progress */}
        {implemented && (
          <div className="implementation-progress p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Implementation Progress</span>
              <span className="text-sm text-green-600">{implementationProgress}%</span>
            </div>
            <Progress value={implementationProgress} className="h-2" />
            {implementationProgress === 100 && (
              <p className="text-xs text-green-700 mt-2">
                ✅ Implementation complete! How did it go?
              </p>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>👀 {content.engagement.views}</span>
          <span>✅ {content.engagement.implementations}</span>
          <span>👍 {content.engagement.likes}</span>
          {content.metadata.peerCount && (
            <span>👥 {content.metadata.peerCount} peers</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          {!implemented ? (
            <Button onClick={handleImplementation} className="flex-1">
              🚀 Implement This
            </Button>
          ) : (
            <Button disabled className="flex-1 bg-green-600">
              ✅ Implemented
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLike}
            className={liked ? 'bg-blue-50 text-blue-600' : ''}
          >
            👍 {liked ? 'Liked' : 'Like'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            className={saved ? 'bg-purple-50 text-purple-600' : ''}
          >
            {saved ? '💾 Saved' : '💾 Save'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleShare}>
            📤 Share
          </Button>
        </div>

        {/* Feedback Section */}
        {showFeedback && (
          <div className="feedback-section p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border animate-fade-in">
            <h4 className="font-semibold mb-3 text-green-800">How did this help your business? 🚀</h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFeedback('revenue_increase')}
                className="hover:bg-green-100"
              >
                💰 Increased Revenue
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFeedback('time_saved')}
                className="hover:bg-blue-100"
              >
                ⏰ Saved Time
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFeedback('efficiency_improved')}
                className="hover:bg-purple-100"
              >
                ⚡ Improved Efficiency
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFeedback('customer_satisfaction')}
                className="hover:bg-yellow-100"
              >
                😊 Better Customer Experience
              </Button>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  💬 Tell us more details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Your Success Story! 🎉</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Tell us more about the impact this had on your business..."
                    className="min-h-[100px]"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={() => handleFeedback('detailed_success')} className="flex-1">
                      📝 Share Success Story
                    </Button>
                    <Button variant="outline" onClick={() => setShowFeedback(false)}>
                      Skip for now
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Implementation Guide Modal */}
        <Dialog open={showImplementationGuide} onOpenChange={setShowImplementationGuide}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>🚀 Implementation Guide</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Great choice! Here's your step-by-step implementation guide:</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Prepare Your Resources</h4>
                    <p className="text-sm text-muted-foreground">Gather the necessary tools and information</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Execute the Strategy</h4>
                    <p className="text-sm text-muted-foreground">Follow the recommended approach step by step</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Monitor Results</h4>
                    <p className="text-sm text-muted-foreground">Track the impact and adjust as needed</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={() => setShowImplementationGuide(false)} className="flex-1">
                  Got it! Let's do this 🚀
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EnhancedRecommendationCard;