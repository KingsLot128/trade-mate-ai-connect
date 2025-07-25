import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BusinessHealthScore {
  current: number;
  target: number;
  progressToNext: number;
  zone: 'chaos' | 'control' | 'clarity';
  nextMilestone: Milestone;
  weeklyImprovement: number;
}

interface Milestone {
  score: number;
  title: string;
  reward: string;
  description: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'legendary';
}

interface Streaks {
  dailyEngagement: number;
  implementationStreak: number;
  improvementStreak: number;
}

const BusinessHealthScore = () => {
  const { user } = useAuth();
  const [healthScore, setHealthScore] = useState<BusinessHealthScore>({
    current: 0,
    target: 100,
    progressToNext: 0,
    zone: 'chaos',
    nextMilestone: { score: 0, title: '', reward: '', description: '' },
    weeklyImprovement: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streaks, setStreaks] = useState<Streaks>({
    dailyEngagement: 0,
    implementationStreak: 0,
    improvementStreak: 0
  });
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBusinessHealth();
      fetchAchievements();
      fetchStreaks();
    }
  }, [user]);

  const fetchBusinessHealth = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('chaos_score, clarity_zone')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        const current = 100 - (profile.chaos_score || 50);
        const zone = getZoneFromScore(current);
        const nextMilestone = getNextMilestone(current);
        const progressToNext = ((current % 25) / 25) * 100;

        setHealthScore({
          current,
          target: 100,
          progressToNext,
          zone,
          nextMilestone,
          weeklyImprovement: Math.random() * 10 // Would calculate from historical data
        });
      }
    } catch (error) {
      console.error('Error fetching business health:', error);
    }
  };

  const fetchAchievements = async () => {
    // In a real app, this would fetch from a dedicated achievements table
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: '🎯 First Steps',
        description: 'Completed your business assessment',
        icon: '🎯',
        unlockedAt: new Date().toISOString(),
        rarity: 'common'
      },
      {
        id: '2',
        title: '📊 Data Collector',
        description: 'Added your first financial data',
        icon: '📊',
        unlockedAt: new Date().toISOString(),
        rarity: 'rare'
      }
    ];
    setAchievements(mockAchievements);
  };

  const fetchStreaks = async () => {
    // Would calculate from user interaction data
    setStreaks({
      dailyEngagement: 5,
      implementationStreak: 3,
      improvementStreak: 2
    });
  };

  const getZoneFromScore = (score: number): 'chaos' | 'control' | 'clarity' => {
    if (score < 40) return 'chaos';
    if (score < 75) return 'control';
    return 'clarity';
  };

  const getNextMilestone = (score: number): Milestone => {
    const milestones = [
      { score: 25, title: 'Getting Organized', reward: '🗂️ Organization Badge', description: 'Basic systems in place' },
      { score: 50, title: 'Taking Control', reward: '⚡ Control Badge', description: 'Efficient operations' },
      { score: 75, title: 'Business Clarity', reward: '🎯 Clarity Badge', description: 'Strategic focus achieved' },
      { score: 100, title: 'Industry Leader', reward: '👑 Leadership Badge', description: 'Top 1% performer' }
    ];

    return milestones.find(m => m.score > score) || milestones[milestones.length - 1];
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'chaos': return 'bg-red-500';
      case 'control': return 'bg-yellow-500';
      case 'clarity': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getZoneGradient = (zone: string) => {
    switch (zone) {
      case 'chaos': return 'from-red-500 to-orange-500';
      case 'control': return 'from-yellow-500 to-amber-500';
      case 'clarity': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'common': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const triggerMilestoneReward = () => {
    setShowCelebration(true);
    toast.success(`🎉 Milestone achieved! ${healthScore.nextMilestone.reward}`);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  return (
    <div className="business-health-score space-y-6">
      {/* Main Health Score Display */}
      <Card className={`relative overflow-hidden ${showCelebration ? 'animate-pulse' : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${getZoneGradient(healthScore.zone)} opacity-10`} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Business Health Score</CardTitle>
              <p className="text-muted-foreground">Your path to business clarity</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{healthScore.current}</div>
              <Badge className={`${getZoneColor(healthScore.zone)} text-white capitalize`}>
                {healthScore.zone}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress to Next Milestone */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {healthScore.nextMilestone.title}</span>
                <span>{healthScore.progressToNext.toFixed(0)}%</span>
              </div>
              <Progress value={healthScore.progressToNext} className="h-3" />
            </div>

            {/* Next Milestone Preview */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{healthScore.nextMilestone.title}</h4>
                  <p className="text-sm text-muted-foreground">{healthScore.nextMilestone.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{healthScore.nextMilestone.score}</div>
                  <div className="text-xs">{healthScore.nextMilestone.reward}</div>
                </div>
              </div>
            </div>

            {/* Weekly Improvement */}
            <div className="flex items-center justify-between text-sm">
              <span>This week's improvement:</span>
              <span className="font-semibold text-green-600">
                +{healthScore.weeklyImprovement.toFixed(1)} points
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streaks Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            🔥 Current Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{streaks.dailyEngagement}</div>
              <div className="text-sm text-muted-foreground">Daily Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{streaks.implementationStreak}</div>
              <div className="text-sm text-muted-foreground">Implementation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{streaks.improvementStreak}</div>
              <div className="text-sm text-muted-foreground">Weekly Growth</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🏆 Recent Achievements
            <Badge variant="secondary">{achievements.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`p-3 rounded-lg ${getRarityColor(achievement.rarity)} animate-fade-in`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm opacity-80">{achievement.description}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {achievement.rarity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Boost Your Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="hover-scale">
              📊 Add Financial Data
              <Badge className="ml-2">+5 pts</Badge>
            </Button>
            <Button variant="outline" className="hover-scale">
              👥 Update Customer Info
              <Badge className="ml-2">+3 pts</Badge>
            </Button>
            <Button variant="outline" className="hover-scale">
              ✅ Complete Recommendation
              <Badge className="ml-2">+8 pts</Badge>
            </Button>
            <Button variant="outline" className="hover-scale">
              🎯 Set Weekly Goal
              <Badge className="ml-2">+2 pts</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <Card className="w-96 animate-scale-in">
            <CardContent className="text-center p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Milestone Achieved!</h2>
              <p className="text-muted-foreground mb-4">{healthScore.nextMilestone.reward}</p>
              <Button onClick={() => setShowCelebration(false)}>
                Awesome!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BusinessHealthScore;