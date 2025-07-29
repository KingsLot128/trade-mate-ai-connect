import { supabase } from '@/integrations/supabase/client';

export interface ClarityReportData {
  businessHealth: {
    score: number;
    factors: Array<{ name: string; score: number; trend: 'up' | 'down' | 'stable' }>;
  };
  keyMetrics: {
    revenue: number;
    customers: number;
    deals: number;
    callsHandled: number;
  };
  insights: Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    actionable: boolean;
  }>;
  recommendations: Array<{
    title: string;
    priority: string;
    expectedImpact: string;
    timeToImplement: string;
  }>;
  dataQuality: {
    completeness: number;
    accuracy: number;
    freshness: number;
  };
}

export class ClarityReportService {
  static async generateMonthlyReport(userId: string): Promise<ClarityReportData> {
    // Gather data from multiple sources
    const [businessHealth, metrics, insights, recommendations] = await Promise.all([
      this.getBusinessHealthData(userId),
      this.getKeyMetrics(userId),
      this.getInsights(userId),
      this.getRecommendations(userId)
    ]);

    return {
      businessHealth,
      keyMetrics: metrics,
      insights,
      recommendations,
      dataQuality: await this.getDataQuality(userId)
    };
  }

  static async generateAISummary(reportData: ClarityReportData): Promise<string> {
    const { data, error } = await supabase.functions.invoke('ai-report-summary', {
      body: { reportData }
    });

    if (error) throw error;
    return data.summary;
  }

  static async generatePDFReport(userId: string): Promise<Blob> {
    const reportData = await this.generateMonthlyReport(userId);
    const aiSummary = await this.generateAISummary(reportData);

    const { data, error } = await supabase.functions.invoke('generate-pdf-report', {
      body: { reportData, aiSummary, userId }
    });

    if (error) throw error;
    return new Blob([data], { type: 'application/pdf' });
  }

  private static async getBusinessHealthData(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('business_health_score, chaos_score')
      .eq('user_id', userId)
      .single();

    return {
      score: data?.business_health_score || 0,
      factors: [
        { name: 'Data Intelligence', score: Math.max(0, 100 - (data?.chaos_score || 50)), trend: 'up' as const },
        { name: 'Operations', score: 75, trend: 'stable' as const },
        { name: 'Financial', score: 80, trend: 'up' as const },
        { name: 'Customer Success', score: 85, trend: 'down' as const }
      ]
    };
  }

  private static async getKeyMetrics(userId: string) {
    const [customers, deals, calls] = await Promise.all([
      supabase.from('customers').select('id').eq('user_id', userId),
      supabase.from('crm_deals').select('amount').eq('user_id', userId),
      supabase.from('calls').select('id').eq('user_id', userId)
    ]);

    const revenue = deals.data?.reduce((sum, deal) => sum + (Number(deal.amount) || 0), 0) || 0;

    return {
      revenue,
      customers: customers.data?.length || 0,
      deals: deals.data?.length || 0,
      callsHandled: calls.data?.length || 0
    };
  }

  private static async getInsights(userId: string) {
    const { data } = await supabase
      .from('business_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    return data?.map(insight => ({
      title: insight.title,
      description: insight.description,
      impact: (insight.impact_estimation?.toLowerCase() === 'high' || 
               insight.impact_estimation?.toLowerCase() === 'low' ? 
               insight.impact_estimation.toLowerCase() : 'medium') as 'high' | 'medium' | 'low',
      actionable: true
    })) || [];
  }

  private static async getRecommendations(userId: string) {
    const { data } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(3);

    return data?.map(rec => ({
      title: rec.title,
      priority: rec.priority,
      expectedImpact: rec.expected_impact,
      timeToImplement: rec.time_to_implement
    })) || [];
  }

  private static async getDataQuality(userId: string) {
    const { data } = await supabase
      .from('unified_business_profiles')
      .select('profile_completeness, intelligence_score')
      .eq('user_id', userId)
      .single();

    const completeness = data?.profile_completeness || 0;
    const intelligence = data?.intelligence_score || 0;

    return {
      completeness,
      accuracy: Math.min(completeness + 10, 100),
      freshness: Math.max(intelligence - 10, 0)
    };
  }
}