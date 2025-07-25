import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import EnhancedRecommendationCard from './EnhancedRecommendationCard';

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

const MultiStreamFeed = () => {
  const { user } = useAuth();
  const [activeStream, setActiveStream] = useState('forYou');
  const [streamContent, setStreamContent] = useState<Record<string, StreamContent[]>>({});
  const [loading, setLoading] = useState(false);

  const streamTabs = [
    { id: 'forYou', label: 'For You', icon: '🎯', description: 'Personalized to your business' },
    { id: 'trending', label: 'Trending', icon: '🔥', description: 'Hot in your industry' },
    { id: 'seasonal', label: 'Seasonal', icon: '📅', description: 'Time-sensitive opportunities' },
    { id: 'peers', label: 'Peers', icon: '👥', description: 'What similar businesses are doing' },
    { id: 'breakthrough', label: 'Breakthrough', icon: '💡', description: 'Game-changing strategies' }
  ];

  useEffect(() => {
    if (user) {
      loadStreamContent(activeStream);
    }
  }, [user, activeStream]);

  const loadStreamContent = async (streamType: string) => {
    setLoading(true);
    try {
      let content: StreamContent[] = [];
      
      switch (streamType) {
        case 'forYou':
          content = await generateForYouContent();
          break;
        case 'trending':
          content = await generateTrendingContent();
          break;
        case 'seasonal':
          content = await generateSeasonalContent();
          break;
        case 'peers':
          content = await generatePeersContent();
          break;
        case 'breakthrough':
          content = await generateBreakthroughContent();
          break;
      }

      setStreamContent(prev => ({
        ...prev,
        [streamType]: content
      }));
    } catch (error) {
      console.error('Error loading stream content:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateForYouContent = async (): Promise<StreamContent[]> => {
    // Get user's existing recommendations
    const { data: recommendations } = await supabase
      .from('enhanced_recommendations')
      .select('*')
      .eq('user_id', user?.id)
      .eq('is_active', true)
      .order('priority_score', { ascending: false })
      .limit(10);

    return recommendations?.map(rec => ({
      id: rec.id,
      type: 'recommendation' as const,
      priority: rec.priority_score > 80 ? 'high' as const : 
               rec.priority_score > 60 ? 'medium' as const : 'low' as const,
      title: (rec.content as any)?.title || 'Recommendation',
      description: (rec.content as any)?.description || 'AI-generated recommendation',
      category: rec.recommendation_type,
      streamType: 'forYou',
      engagement: {
        views: Math.floor(Math.random() * 100),
        implementations: Math.floor(Math.random() * 50),
        likes: Math.floor(Math.random() * 75)
      },
      metadata: {}
    })) || [];
  };

  const generateTrendingContent = async (): Promise<StreamContent[]> => {
    // Mock trending content based on industry patterns
    return [
      {
        id: 'trend-1',
        type: 'trend',
        priority: 'high',
        title: '🔥 AI-Powered Customer Follow-ups are Converting 40% Better',
        description: 'Construction companies using automated follow-up sequences are seeing massive conversion improvements. Here\'s the exact template.',
        category: 'sales',
        streamType: 'trending',
        engagement: {
          views: 1247,
          implementations: 89,
          likes: 234
        },
        metadata: {
          industry: 'construction',
          trendingScore: 95
        }
      },
      {
        id: 'trend-2',
        type: 'trend',
        priority: 'high',
        title: '📈 Weekly Revenue Reviews = 23% Growth',
        description: 'Small businesses doing weekly revenue analysis are outperforming by 23%. Takes just 15 minutes.',
        category: 'financial',
        streamType: 'trending',
        engagement: {
          views: 892,
          implementations: 156,
          likes: 198
        },
        metadata: {
          trendingScore: 87
        }
      }
    ];
  };

  const generateSeasonalContent = async (): Promise<StreamContent[]> => {
    const currentMonth = new Date().getMonth();
    const seasonalContent = [
      {
        id: 'seasonal-1',
        type: 'insight' as const,
        priority: 'high' as const,
        title: '🏖️ Summer Slowdown Strategy',
        description: 'July-August typically see 30% fewer leads. Here\'s how to maintain momentum and prepare for fall.',
        category: 'seasonal',
        streamType: 'seasonal',
        engagement: {
          views: 445,
          implementations: 67,
          likes: 123
        },
        metadata: {
          seasonality: 'summer'
        }
      }
    ];

    return seasonalContent;
  };

  const generatePeersContent = async (): Promise<StreamContent[]> => {
    return [
      {
        id: 'peer-1',
        type: 'insight',
        priority: 'medium',
        title: '👥 What 50+ Similar Businesses Are Doing Right Now',
        description: 'Anonymous insights from businesses in your size range and industry. See what\'s working.',
        category: 'peers',
        streamType: 'peers',
        engagement: {
          views: 234,
          implementations: 45,
          likes: 78
        },
        metadata: {
          peerCount: 52
        }
      }
    ];
  };

  const generateBreakthroughContent = async (): Promise<StreamContent[]> => {
    return [
      {
        id: 'breakthrough-1',
        type: 'recommendation',
        priority: 'high',
        title: '💡 The 2-Hour Weekly System That Changed Everything',
        description: 'One contractor went from chaos (score: 78) to clarity (score: 23) using this simple weekly routine. Game-changer.',
        category: 'systems',
        streamType: 'breakthrough',
        engagement: {
          views: 1823,
          implementations: 234,
          likes: 445
        },
        metadata: {}
      }
    ];
  };

  const handleStreamEngagement = async (contentId: string, action: string) => {
    // Track engagement for algorithm learning
    try {
      await supabase
        .from('recommendation_interactions')
        .insert({
          user_id: user?.id,
          recommendation_id: contentId,
          interaction_type: action,
          metadata: {
            streamType: activeStream,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  };

  const getStreamStats = (streamType: string) => {
    const content = streamContent[streamType] || [];
    const totalEngagement = content.reduce((sum, item) => 
      sum + item.engagement.views + item.engagement.implementations + item.engagement.likes, 0
    );
    return {
      contentCount: content.length,
      totalEngagement,
      highPriorityCount: content.filter(c => c.priority === 'high').length
    };
  };

  return (
    <div className="multi-stream-feed space-y-4 md:space-y-6">
      <div className="text-center mb-6 md:mb-8 px-2">
        <h2 className="text-xl md:text-3xl font-bold mb-2">Business Intelligence Feed</h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
          Discover insights, trends, and strategies tailored to your success
        </p>
      </div>

      <Tabs value={activeStream} onValueChange={setActiveStream} className="w-full">
        {/* Enhanced Tab Navigation */}
        <TabsList className="flex w-full bg-muted/50 p-1 h-auto overflow-x-auto scrollbar-hide">
          {streamTabs.map(tab => {
            const stats = getStreamStats(tab.id);
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex flex-col min-w-fit px-2 md:px-3 py-2 h-auto data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
              >
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-base md:text-lg">{tab.icon}</span>
                  <span className="font-medium text-xs md:text-sm hidden sm:inline">{tab.label}</span>
                  <span className="font-medium text-xs md:text-sm sm:hidden">{tab.label.split(' ')[0]}</span>
                  {stats.highPriorityCount > 0 && (
                    <Badge variant="destructive" className="text-xs h-4 px-1">
                      {stats.highPriorityCount}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground text-center hidden md:block max-w-24 truncate">
                  {tab.description}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Stream Content */}
        {streamTabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4 mt-6">
            {/* Stream Header with Stats */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      {tab.icon} {tab.label} Stream
                    </h3>
                    <p className="text-sm text-muted-foreground">{tab.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {getStreamStats(tab.id).contentCount} insights available
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getStreamStats(tab.id).totalEngagement} total engagement
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Cards */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {(streamContent[tab.id] || []).map(content => (
                  <EnhancedRecommendationCard
                    key={content.id}
                    content={content}
                    onEngagement={(action) => handleStreamEngagement(content.id, action)}
                  />
                ))}
                
                {(streamContent[tab.id] || []).length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <div className="text-6xl mb-4">{tab.icon}</div>
                      <h3 className="text-lg font-semibold mb-2">More {tab.label} Content Coming Soon</h3>
                      <p className="text-muted-foreground mb-4">
                        We're generating personalized {tab.label.toLowerCase()} content for you.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => loadStreamContent(tab.id)}
                      >
                        Refresh Content
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MultiStreamFeed;