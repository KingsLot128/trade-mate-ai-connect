import { UnifiedBusinessProfile } from './dataUnification';
import { supabase } from '@/integrations/supabase/client';

interface UserBehavior {
  implementationRate: number;
  preferredComplexity: 'simple' | 'moderate' | 'advanced';
  engagementPatterns: string[];
  growthAmbition: 'maintain' | 'grow' | 'scale';
}

interface Recommendation {
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
  streamType?: string;
}

interface RecommendationContext {
  unifiedProfile: UnifiedBusinessProfile;
  userBehavior: UserBehavior;
  industryBenchmarks: {
    financial: { averageRevenue: number; averageExpenses: number; };
    sales: { averageConversionRate: number; averageDealSize: number; };
  };
}

export const generateAdaptiveRecommendations = async (
  userId: string,
  context: RecommendationContext
): Promise<Recommendation[]> => {
  const { unifiedProfile, userBehavior, industryBenchmarks } = context;
  
  const recommendations: Recommendation[] = [];
  
  // Financial recommendations
  if (unifiedProfile.financialData.confidence > 70) {
    const financialRecs = await generateFinancialRecommendations(
      unifiedProfile.financialData,
      industryBenchmarks.financial,
      userBehavior.implementationRate
    );
    recommendations.push(...financialRecs);
  }
  
  // Customer/sales recommendations
  if (unifiedProfile.customerData.confidence > 70) {
    const customerRecs = await generateCustomerRecommendations(
      unifiedProfile.customerData,
      industryBenchmarks.sales,
      userBehavior.preferredComplexity
    );
    recommendations.push(...customerRecs);
  }
  
  // Operational recommendations (always available from quiz)
  const operationalRecs = await generateOperationalRecommendations(
    unifiedProfile.quizInsights,
    unifiedProfile.scheduleData,
    userBehavior.engagementPatterns
  );
  recommendations.push(...operationalRecs);
  
  // Strategic recommendations based on chaos score
  const strategicRecs = await generateStrategicRecommendations(
    unifiedProfile.quizInsights.chaosScore,
    unifiedProfile.businessInfo.industry,
    userBehavior.growthAmbition
  );
  recommendations.push(...strategicRecs);
  
  // Rank and personalize recommendations
  const rankedRecommendations = await rankRecommendations(
    recommendations,
    userBehavior,
    unifiedProfile
  );
  
  // Store recommendations in database
  await storeRecommendations(userId, rankedRecommendations.slice(0, 10));
  
  return rankedRecommendations.slice(0, 10);
};

const generateFinancialRecommendations = async (
  financialData: any,
  benchmarks: any,
  implementationRate: number
): Promise<Recommendation[]> => {
  const recommendations: Recommendation[] = [];
  
  // Revenue optimization
  if (financialData.revenue < benchmarks.averageRevenue) {
    const revenueGap = benchmarks.averageRevenue - financialData.revenue;
    const percentageGap = (revenueGap / benchmarks.averageRevenue) * 100;
    
    recommendations.push({
      id: `revenue_optimization_${Date.now()}`,
      type: 'revenue',
      priority: percentageGap > 30 ? 'urgent' : 'high',
      hook: `You're missing $${revenueGap.toLocaleString()} in potential monthly revenue`,
      title: 'Revenue Optimization Opportunity',
      description: `Based on ${financialData.source} data, businesses like yours typically earn ${percentageGap.toFixed(0)}% more. Here's how to close the gap.`,
      reasoning: `Your current revenue is ${percentageGap.toFixed(0)}% below industry average. Similar businesses increased revenue by implementing these specific strategies.`,
      expectedImpact: `$${(revenueGap * 0.6).toLocaleString()} monthly increase`,
      timeToImplement: implementationRate > 0.7 ? '2-3 weeks' : '1-2 months',
      personalizedScore: 90,
      confidenceScore: financialData.confidence,
      urgencyScore: Math.min(100, percentageGap * 2),
      actions: [
        'Analyze top revenue sources',
        'Implement pricing optimization',
        'Expand successful service offerings',
        'Improve customer retention'
      ],
      streamType: 'forYou'
    });
  }
  
  // Expense optimization
  if (financialData.expenses > benchmarks.averageExpenses) {
    const expenseExcess = financialData.expenses - benchmarks.averageExpenses;
    
    recommendations.push({
      id: `expense_optimization_${Date.now()}`,
      type: 'efficiency',
      priority: 'medium',
      hook: `You could save $${expenseExcess.toLocaleString()} monthly on expenses`,
      title: 'Expense Optimization Plan',
      description: 'AI analysis shows specific areas where you can reduce costs without impacting quality.',
      reasoning: 'Your expense ratio is higher than industry benchmarks. These optimizations maintain quality while improving profitability.',
      expectedImpact: `$${(expenseExcess * 0.4).toLocaleString()} monthly savings`,
      timeToImplement: '2-4 weeks',
      personalizedScore: 85,
      confidenceScore: financialData.confidence,
      urgencyScore: 60,
      actions: [
        'Review recurring subscriptions',
        'Negotiate supplier contracts',
        'Optimize operational efficiency',
        'Eliminate redundant processes'
      ],
      streamType: 'efficiency'
    });
  }
  
  return recommendations;
};

const generateCustomerRecommendations = async (
  customerData: any,
  benchmarks: any,
  preferredComplexity: string
): Promise<Recommendation[]> => {
  const recommendations: Recommendation[] = [];
  
  // Conversion rate optimization
  if (customerData.conversionRate < benchmarks.averageConversionRate) {
    const conversionGap = benchmarks.averageConversionRate - customerData.conversionRate;
    
    recommendations.push({
      id: `conversion_optimization_${Date.now()}`,
      type: 'growth',
      priority: 'high',
      hook: `Increase your conversion rate by ${conversionGap.toFixed(1)}% to match top performers`,
      title: 'Lead Conversion Optimization',
      description: `Your ${customerData.conversionRate.toFixed(1)}% conversion rate has room for improvement. Industry leaders achieve ${benchmarks.averageConversionRate.toFixed(1)}%.`,
      reasoning: 'Better lead qualification and follow-up processes typically increase conversion rates by 20-40%.',
      expectedImpact: `${Math.floor(customerData.totalLeads * (conversionGap / 100))} more conversions monthly`,
      timeToImplement: preferredComplexity === 'simple' ? '1-2 weeks' : '3-4 weeks',
      personalizedScore: 88,
      confidenceScore: customerData.confidence,
      urgencyScore: 75,
      actions: [
        'Implement lead scoring system',
        'Create follow-up automation',
        'Improve qualification process',
        'Optimize sales materials'
      ],
      streamType: 'growth'
    });
  }
  
  return recommendations;
};

const generateOperationalRecommendations = async (
  quizInsights: any,
  scheduleData: any,
  engagementPatterns: string[]
): Promise<Recommendation[]> => {
  const recommendations: Recommendation[] = [];
  
  // Chaos score recommendations
  if (quizInsights.chaosScore > 70) {
    recommendations.push({
      id: `chaos_reduction_${Date.now()}`,
      type: 'operational',
      priority: 'urgent',
      hook: `Your chaos score of ${quizInsights.chaosScore} indicates urgent need for systems`,
      title: 'Business Process Stabilization',
      description: 'High chaos scores correlate with burnout and missed opportunities. Let\'s create simple systems that work.',
      reasoning: 'Businesses with chaos scores above 70 typically see 30% productivity gains from basic process improvements.',
      expectedImpact: '4-6 hours saved weekly, reduced stress',
      timeToImplement: '1-2 weeks',
      personalizedScore: 95,
      confidenceScore: 100,
      urgencyScore: 90,
      actions: [
        'Implement simple task management',
        'Create customer communication templates',
        'Set up basic automation',
        'Establish daily routines'
      ],
      streamType: 'forYou'
    });
  }
  
  return recommendations;
};

const generateStrategicRecommendations = async (
  chaosScore: number,
  industry: string,
  growthAmbition: string
): Promise<Recommendation[]> => {
  const recommendations: Recommendation[] = [];
  
  if (growthAmbition === 'scale' && chaosScore < 40) {
    recommendations.push({
      id: `scaling_strategy_${Date.now()}`,
      type: 'strategic',
      priority: 'high',
      hook: 'Your low chaos score indicates readiness for strategic growth',
      title: 'Scale-Ready Business Optimization',
      description: 'Your organized foundation positions you perfectly for systematic growth. Here\'s your scaling roadmap.',
      reasoning: 'Low chaos scores indicate strong operational foundation - the ideal time to implement growth strategies.',
      expectedImpact: '25-40% revenue growth potential',
      timeToImplement: '2-3 months',
      personalizedScore: 92,
      confidenceScore: 95,
      urgencyScore: 70,
      actions: [
        'Develop systematic sales process',
        'Create scalable service delivery',
        'Build strategic partnerships',
        'Implement growth metrics'
      ],
      streamType: 'strategic'
    });
  }
  
  return recommendations;
};

const rankRecommendations = async (
  recommendations: Recommendation[],
  userBehavior: UserBehavior,
  profile: UnifiedBusinessProfile
): Promise<Recommendation[]> => {
  return recommendations.sort((a, b) => {
    // Calculate composite score
    const scoreA = (a.personalizedScore * 0.4) + (a.urgencyScore * 0.3) + (a.confidenceScore * 0.3);
    const scoreB = (b.personalizedScore * 0.4) + (b.urgencyScore * 0.3) + (b.confidenceScore * 0.3);
    
    return scoreB - scoreA;
  });
};

const storeRecommendations = async (userId: string, recommendations: Recommendation[]) => {
  const recommendationsToStore = recommendations.map(rec => ({
    user_id: userId,
    recommendation_id: rec.id,
    recommendation_type: rec.type,
    hook: rec.hook,
    reasoning: rec.reasoning,
    content: {
      title: rec.title,
      description: rec.description,
      expectedImpact: rec.expectedImpact,
      timeToImplement: rec.timeToImplement,
      actions: rec.actions
    },
    priority_score: rec.urgencyScore,
    confidence_score: rec.confidenceScore,
    personalized_score: rec.personalizedScore,
    stream_type: rec.streamType || 'forYou'
  }));

  try {
    await supabase
      .from('enhanced_recommendations')
      .upsert(recommendationsToStore, {
        onConflict: 'user_id,recommendation_id'
      });
  } catch (error) {
    console.error('Error storing recommendations:', error);
  }
};

export const getUserBehavior = async (userId: string): Promise<UserBehavior> => {
  // Get user profile and interaction data
  const { data: profile } = await supabase
    .from('profiles')
    .select('setup_preference, chaos_score')
    .eq('user_id', userId)
    .single();

  const { data: interactions } = await supabase
    .from('recommendation_interactions')
    .select('*')
    .eq('user_id', userId);

  const implementationRate = interactions?.length > 0 
    ? interactions.filter(i => i.interaction_type === 'implemented').length / interactions.length
    : 0.5;

  return {
    implementationRate,
    preferredComplexity: profile?.setup_preference === 'minimal' ? 'simple' : 
                        profile?.setup_preference === 'connect' ? 'advanced' : 'moderate',
    engagementPatterns: interactions?.map(i => i.interaction_type) || [],
    growthAmbition: profile?.chaos_score > 70 ? 'maintain' : 
                   profile?.chaos_score > 40 ? 'grow' : 'scale'
  };
};

export const getIndustryBenchmarks = (industry: string) => {
  // Simplified benchmarks - in production, this would come from a comprehensive database
  const benchmarks = {
    'construction': {
      financial: { averageRevenue: 25000, averageExpenses: 18000 },
      sales: { averageConversionRate: 15, averageDealSize: 5000 }
    },
    'consulting': {
      financial: { averageRevenue: 15000, averageExpenses: 8000 },
      sales: { averageConversionRate: 25, averageDealSize: 2500 }
    },
    'retail': {
      financial: { averageRevenue: 30000, averageExpenses: 22000 },
      sales: { averageConversionRate: 35, averageDealSize: 150 }
    }
  };

  return benchmarks[industry as keyof typeof benchmarks] || benchmarks.consulting;
};