import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SessionIntelligenceService, SessionStats } from '@/services/SessionIntelligenceService';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Zap, Target, TrendingUp } from 'lucide-react';

const SessionIntelligenceWidget: React.FC = () => {
  const { user } = useAuth();
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSessionStats();
    }
  }, [user]);

  const loadSessionStats = async () => {
    try {
      const stats = await SessionIntelligenceService.getSessionStats(user!.id);
      setSessionStats(stats);
    } catch (error) {
      console.error('Error loading session stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="session-intelligence-widget">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Session Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sessionStats) return null;

  return (
    <Card className="session-intelligence-widget">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Session Intelligence
          <Badge variant="secondary">Level {sessionStats.level}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Clarity Points */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Clarity Points</span>
          </div>
          <Badge variant="outline" className="bg-yellow-50">
            +{sessionStats.clarityPointsGained}
          </Badge>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Level Progress</span>
            <span>{sessionStats.nextLevelProgress}/100</span>
          </div>
          <Progress value={sessionStats.nextLevelProgress} className="h-2" />
        </div>

        {/* Tasks Completed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Tasks Completed</span>
          </div>
          <Badge variant="outline" className="bg-green-50">
            {sessionStats.tasksCompleted}
          </Badge>
        </div>

        {/* Data Quality Improvement */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Data Quality</span>
          </div>
          <Badge variant="outline" className="bg-blue-50">
            {Math.round(sessionStats.dataQualityImprovement)}%
          </Badge>
        </div>

        {/* Streak */}
        {sessionStats.streakDays > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-medium">Streak</span>
            </div>
            <Badge variant="outline" className="bg-orange-50">
              {sessionStats.streakDays} days
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionIntelligenceWidget;