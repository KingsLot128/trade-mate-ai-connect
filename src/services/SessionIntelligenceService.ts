import { supabase } from '@/integrations/supabase/client';

export interface ClarityPoint {
  id: string;
  userId: string;
  pointType: 'data_entry' | 'profile_completion' | 'integration_connected' | 'insight_viewed' | 'action_completed';
  points: number;
  description: string;
  sessionId: string;
  createdAt: string;
}

export interface SessionStats {
  clarityPointsGained: number;
  tasksCompleted: number;
  dataQualityImprovement: number;
  streakDays: number;
  level: number;
  nextLevelProgress: number;
}

export class SessionIntelligenceService {
  static async awardClarityPoints(
    userId: string, 
    pointType: ClarityPoint['pointType'], 
    description: string,
    sessionId?: string
  ) {
    const pointValues = {
      'data_entry': 10,
      'profile_completion': 25,
      'integration_connected': 50,
      'insight_viewed': 5,
      'action_completed': 15
    };

    const { data, error } = await supabase
      .from('clarity_points')
      .insert({
        user_id: userId,
        point_type: pointType,
        points: pointValues[pointType],
        description,
        session_id: sessionId || crypto.randomUUID()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getSessionStats(userId: string): Promise<SessionStats> {
    const { data: points, error } = await supabase
      .from('clarity_points')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const totalPoints = points?.reduce((sum, p) => sum + p.points, 0) || 0;
    const tasksCompleted = points?.filter(p => p.point_type === 'action_completed').length || 0;
    
    // Calculate level (every 100 points = 1 level)
    const level = Math.floor(totalPoints / 100) + 1;
    const nextLevelProgress = (totalPoints % 100);

    return {
      clarityPointsGained: totalPoints,
      tasksCompleted,
      dataQualityImprovement: Math.min(totalPoints / 10, 100),
      streakDays: await this.calculateStreak(userId),
      level,
      nextLevelProgress
    };
  }

  private static async calculateStreak(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('clarity_points')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error || !data) return 0;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasActivity = data.some(point => {
        const pointDate = new Date(point.created_at);
        return pointDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasActivity) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}