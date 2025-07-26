import React from 'react';
import { AIInsightsPanel } from '@/components/ai/AIInsightsPanel';
import SmartRecommendationEngine from '@/components/ai/SmartRecommendationEngine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, TrendingUp, Zap } from 'lucide-react';

const Recommendations: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg">
          <Brain className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Business Intelligence</h1>
          <p className="text-muted-foreground">
            Get personalized insights, recommendations, and predictions powered by advanced AI
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Active Insights</div>
                <div className="text-2xl font-bold">12</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <div className="text-sm text-muted-foreground">Implemented</div>
                <div className="text-2xl font-bold">8</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <div>
                <div className="text-sm text-muted-foreground">Impact Score</div>
                <div className="text-2xl font-bold">85%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-secondary" />
              <div>
                <div className="text-sm text-muted-foreground">AI Confidence</div>
                <div className="text-2xl font-bold">92%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights & Analysis
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Smart Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <AIInsightsPanel />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <SmartRecommendationEngine />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recommendations;