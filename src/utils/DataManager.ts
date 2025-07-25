import { supabase } from '@/integrations/supabase/client';

// Types for the universal intelligence system
export interface CompleteUserProfile {
  profile: any;
  businessSettings: any;
  quizData: any;
  websiteData: any;
  aiPreferences: any;
  completeness: number;
}

export interface WebsiteAnalysisData {
  url: string;
  analysis: {
    seo: {
      score: number;
      recommendations: string[];
    };
    design: {
      score: number;
      visualRecommendations: string[];
      uxRecommendations: string[];
    };
    conversion: {
      score: number;
      potentialIncrease: number;
      ctaRecommendations: string[];
      trustRecommendations: string[];
    };
  };
  recommendations: any[];
}

export interface AIPreferencesData {
  frequency: string;
  focusAreas: string[];
  complexity: string;
  benchmarking: boolean;
  predictive: boolean;
  competitive: boolean;
}

/**
 * DataManager - Universal Intelligence Engine
 * Handles all data operations, AI recommendations, and business intelligence
 */
export class DataManager {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // ============= CORE PROFILE METHODS =============

  async getCompleteUserProfile(): Promise<CompleteUserProfile> {
    try {
      const [profile, businessSettings, quizData, websiteData, aiPreferences] = await Promise.all([
        this.getUserProfile(),
        this.getBusinessSettings(),
        this.getQuizData(),
        this.getWebsiteAnalysis(),
        this.getAIPreferences()
      ]);

      const completeness = await this.calculateProfileCompleteness({
        profile,
        businessSettings,
        quizData,
        websiteData,
        aiPreferences
      });

      return {
        profile,
        businessSettings,
        quizData,
        websiteData,
        aiPreferences,
        completeness
      };
    } catch (error) {
      console.error('Get complete user profile failed:', error);
      throw error;
    }
  }

  async getUserProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', this.userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get user profile failed:', error);
      return null;
    }
  }

  async getBusinessSettings() {
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', this.userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get business settings failed:', error);
      return null;
    }
  }

  async getQuizData() {
    try {
      const { data, error } = await supabase
        .from('user_quiz_responses')
        .select('*')
        .eq('user_id', this.userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get quiz data failed:', error);
      return null;
    }
  }

  async getWebsiteAnalysis() {
    try {
      const { data, error } = await supabase
        .from('website_analysis')
        .select('*')
        .eq('user_id', this.userId)
        .order('last_analyzed', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get website analysis failed:', error);
      return null;
    }
  }

  async getAIPreferences() {
    try {
      const { data, error } = await supabase
        .from('ai_preferences')
        .select('*')
        .eq('user_id', this.userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get AI preferences failed:', error);
      return null;
    }
  }

  // ============= WEBSITE ANALYSIS METHODS =============

  async updateWebsiteAnalysis(websiteData: WebsiteAnalysisData) {
    try {
      const { data, error } = await supabase
        .from('website_analysis')
        .upsert({
          user_id: this.userId,
          website_url: websiteData.url,
          seo_score: websiteData.analysis.seo.score,
          design_score: websiteData.analysis.design.score,
          conversion_score: websiteData.analysis.conversion.score,
          analysis_data: websiteData.analysis,
          recommendations: websiteData.recommendations,
          last_analyzed: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update universal intelligence with website insights
      await this.updateUniversalIntelligence({ 
        websiteData: websiteData,
        source: 'website_analysis'
      });

      // Generate website-specific recommendations
      await this.generateWebsiteRecommendations(websiteData.analysis);

      return data;
    } catch (error) {
      console.error('Update website analysis failed:', error);
      return null;
    }
  }

  async analyzeWebsite(url: string): Promise<WebsiteAnalysisData> {
    // Simulate website analysis (you can implement actual analysis later)
    const mockAnalysis: WebsiteAnalysisData = {
      url,
      analysis: {
        seo: {
          score: Math.floor(Math.random() * 40) + 40, // 40-80
          recommendations: [
            'Add meta descriptions to all pages',
            'Optimize page loading speed',
            'Improve internal linking structure',
            'Add alt text to images'
          ]
        },
        design: {
          score: Math.floor(Math.random() * 30) + 50, // 50-80
          visualRecommendations: [
            'Improve color contrast for better accessibility',
            'Use consistent typography across pages',
            'Add more white space for better readability'
          ],
          uxRecommendations: [
            'Simplify navigation menu',
            'Add search functionality',
            'Improve mobile responsiveness'
          ]
        },
        conversion: {
          score: Math.floor(Math.random() * 35) + 45, // 45-80
          potentialIncrease: Math.floor(Math.random() * 25) + 15, // 15-40%
          ctaRecommendations: [
            'Make call-to-action buttons more prominent',
            'Add urgency to your offers',
            'Reduce form fields for better conversions'
          ],
          trustRecommendations: [
            'Add customer testimonials',
            'Display security badges',
            'Include contact information prominently'
          ]
        }
      },
      recommendations: []
    };

    return mockAnalysis;
  }

  private async generateWebsiteRecommendations(analysis: WebsiteAnalysisData['analysis']) {
    try {
      const recommendations = [];

      // SEO recommendations
      if (analysis.seo.score < 70) {
        recommendations.push({
          user_id: this.userId,
          recommendation_type: 'seo',
          title: 'Boost Your Website SEO',
          description: `Your SEO score is ${analysis.seo.score}/100. Implementing these changes could increase organic traffic by 25%.`,
          hook: `Your website SEO score is ${analysis.seo.score}/100 - here's how to improve it`,
          priority: 'high',
          expected_impact: '+25% organic traffic',
          time_to_implement: '2-3 weeks',
          reasoning: 'SEO improvements directly impact your online visibility and customer acquisition.',
          actions: JSON.stringify(analysis.seo.recommendations.slice(0, 3)),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }

      // Conversion recommendations
      if (analysis.conversion.score < 60) {
        recommendations.push({
          user_id: this.userId,
          recommendation_type: 'conversion',
          title: 'Increase Website Conversions',
          description: `Your conversion score is ${analysis.conversion.score}/100. These optimizations could increase conversions by ${analysis.conversion.potentialIncrease}%.`,
          hook: `Your website could convert ${analysis.conversion.potentialIncrease}% more visitors into customers`,
          priority: 'high',
          expected_impact: `+${analysis.conversion.potentialIncrease}% conversions`,
          time_to_implement: '1-2 weeks',
          reasoning: 'Conversion optimization directly impacts your revenue from existing traffic.',
          actions: JSON.stringify(analysis.conversion.ctaRecommendations.slice(0, 3)),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }

      // Design recommendations
      if (analysis.design.score < 75) {
        recommendations.push({
          user_id: this.userId,
          recommendation_type: 'design',
          title: 'Improve Website Design',
          description: `Your design score is ${analysis.design.score}/100. Better design increases user trust and engagement.`,
          hook: `Professional design improvements could increase user engagement by 40%`,
          priority: 'medium',
          expected_impact: '+40% user engagement',
          time_to_implement: '3-4 weeks',
          reasoning: 'Professional design builds trust and credibility with potential customers.',
          actions: JSON.stringify([...analysis.design.visualRecommendations, ...analysis.design.uxRecommendations].slice(0, 3)),
          expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
        });
      }

      // Insert recommendations
      if (recommendations.length > 0) {
        await supabase
          .from('ai_recommendations')
          .insert(recommendations);
      }

    } catch (error) {
      console.error('Generate website recommendations failed:', error);
    }
  }

  // ============= AI PREFERENCES METHODS =============

  async updateAIPreferences(preferences: AIPreferencesData) {
    try {
      const { data, error } = await supabase
        .from('ai_preferences')
        .upsert({
          user_id: this.userId,
          frequency: preferences.frequency,
          focus_areas: preferences.focusAreas,
          complexity: preferences.complexity,
          benchmarking: preferences.benchmarking,
          predictive: preferences.predictive,
          competitive: preferences.competitive,
          preferences_data: JSON.stringify(preferences),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update recommendation algorithm with new preferences
      await this.updateRecommendationAlgorithm(preferences);

      return data;
    } catch (error) {
      console.error('Update AI preferences failed:', error);
      return null;
    }
  }

  private async updateRecommendationAlgorithm(preferences: AIPreferencesData) {
    try {
      // Update user's recommendation preferences in unified profile
      await supabase
        .from('unified_business_profiles')
        .upsert({
          user_id: this.userId,
          ai_preferences: JSON.stringify(preferences),
          last_updated: new Date().toISOString()
        });

      // Regenerate recommendations based on new preferences
      await this.regeneratePersonalizedRecommendations(preferences);

    } catch (error) {
      console.error('Update recommendation algorithm failed:', error);
    }
  }

  private async regeneratePersonalizedRecommendations(preferences: AIPreferencesData) {
    try {
      // Get complete user profile for context
      const completeProfile = await this.getCompleteUserProfile();

      // Generate new recommendations based on preferences
      const newRecommendations = await this.generatePersonalizedRecommendations(
        completeProfile,
        preferences
      );

      // Replace existing pending recommendations
      await supabase
        .from('ai_recommendations')
        .delete()
        .eq('user_id', this.userId)
        .eq('status', 'pending');

      if (newRecommendations.length > 0) {
        await supabase
          .from('ai_recommendations')
          .insert(newRecommendations);
      }

    } catch (error) {
      console.error('Regenerate personalized recommendations failed:', error);
    }
  }

  // ============= RECOMMENDATION ENGINE =============

  async getRecommendations(status = 'pending', limit = 20) {
    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', this.userId)
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Get recommendations failed:', error);
      return [];
    }
  }

  private async generatePersonalizedRecommendations(
    profile: CompleteUserProfile,
    preferences: AIPreferencesData
  ): Promise<any[]> {
    const recommendations = [];

    // Focus area-based recommendations
    if (preferences.focusAreas?.includes('Revenue Growth')) {
      recommendations.push(...await this.generateRevenueGrowthRecommendations(profile));
    }

    if (preferences.focusAreas?.includes('Operational Efficiency')) {
      recommendations.push(...await this.generateEfficiencyRecommendations(profile));
    }

    if (preferences.focusAreas?.includes('Customer Acquisition')) {
      recommendations.push(...await this.generateCustomerAcquisitionRecommendations(profile));
    }

    if (preferences.focusAreas?.includes('Team Management')) {
      recommendations.push(...await this.generateTeamManagementRecommendations(profile));
    }

    if (preferences.focusAreas?.includes('Financial Health')) {
      recommendations.push(...await this.generateFinancialHealthRecommendations(profile));
    }

    if (preferences.focusAreas?.includes('Marketing & Sales')) {
      recommendations.push(...await this.generateMarketingSalesRecommendations(profile));
    }

    // Complexity-based filtering
    const filteredRecommendations = recommendations.filter(rec => {
      if (preferences.complexity === 'simple') {
        return rec.complexity === 'simple' || rec.complexity === 'moderate';
      } else if (preferences.complexity === 'moderate') {
        return rec.complexity !== 'advanced';
      }
      return true; // Advanced users get all recommendations
    });

    // Frequency-based limiting
    const maxRecommendations = preferences.frequency === 'daily' ? 7 : 
                              preferences.frequency === 'weekly' ? 15 : 
                              filteredRecommendations.length;

    return filteredRecommendations
      .sort((a, b) => this.calculateRecommendationScore(b, profile) - this.calculateRecommendationScore(a, profile))
      .slice(0, maxRecommendations)
      .map(rec => ({
        ...rec,
        user_id: this.userId,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }));
  }

  // ============= RECOMMENDATION GENERATORS =============

  private async generateRevenueGrowthRecommendations(profile: CompleteUserProfile) {
    const recommendations = [
      {
        recommendation_type: 'revenue_growth',
        title: 'Optimize Your Pricing Strategy',
        description: 'Review and adjust your pricing based on market analysis and competitor research.',
        hook: 'Proper pricing could increase your revenue by 15-25%',
        priority: 'high',
        expected_impact: '+20% revenue',
        time_to_implement: '1-2 weeks',
        reasoning: 'Pricing optimization is one of the fastest ways to increase revenue without additional costs.',
        complexity: 'moderate',
        industries: [profile.profile?.industry],
        business_sizes: [profile.profile?.business_size]
      },
      {
        recommendation_type: 'revenue_growth',
        title: 'Implement Upselling Strategies',
        description: 'Create systematic upselling processes to increase average transaction value.',
        hook: 'Upselling to existing customers is 5x more cost-effective than acquiring new ones',
        priority: 'high',
        expected_impact: '+30% average order value',
        time_to_implement: '2-3 weeks',
        reasoning: 'Existing customers trust you and are more likely to purchase additional services.',
        complexity: 'simple',
        industries: [profile.profile?.industry],
        business_sizes: [profile.profile?.business_size]
      }
    ];

    return recommendations;
  }

  private async generateEfficiencyRecommendations(profile: CompleteUserProfile) {
    const recommendations = [
      {
        recommendation_type: 'efficiency',
        title: 'Automate Routine Administrative Tasks',
        description: 'Implement automation tools for scheduling, invoicing, and customer communications.',
        hook: 'Save 10+ hours per week with smart automation',
        priority: 'medium',
        expected_impact: '+10 hours/week',
        time_to_implement: '1-3 weeks',
        reasoning: 'Automation frees up time for revenue-generating activities and reduces errors.',
        complexity: 'moderate',
        industries: [profile.profile?.industry],
        business_sizes: [profile.profile?.business_size]
      }
    ];

    return recommendations;
  }

  private async generateCustomerAcquisitionRecommendations(profile: CompleteUserProfile) {
    const recommendations = [
      {
        recommendation_type: 'customer_acquisition',
        title: 'Implement Referral Program',
        description: 'Create a systematic referral program to leverage your existing customer base.',
        hook: 'Referral programs can generate 30% of new business for service companies',
        priority: 'high',
        expected_impact: '+30% new customers',
        time_to_implement: '2-4 weeks',
        reasoning: 'Word-of-mouth referrals have the highest conversion rate and lowest acquisition cost.',
        complexity: 'simple',
        industries: [profile.profile?.industry],
        business_sizes: [profile.profile?.business_size]
      }
    ];

    return recommendations;
  }

  private async generateTeamManagementRecommendations(profile: CompleteUserProfile) {
    const recommendations = [
      {
        recommendation_type: 'team_management',
        title: 'Implement Team Performance Tracking',
        description: 'Set up KPIs and regular performance reviews to optimize team productivity.',
        hook: 'Clear performance metrics increase team productivity by 25%',
        priority: 'medium',
        expected_impact: '+25% team productivity',
        time_to_implement: '2-3 weeks',
        reasoning: 'What gets measured gets managed - clear metrics improve accountability and performance.',
        complexity: 'moderate',
        industries: [profile.profile?.industry],
        business_sizes: ['small', 'medium', 'large']
      }
    ];

    return recommendations;
  }

  private async generateFinancialHealthRecommendations(profile: CompleteUserProfile) {
    const recommendations = [
      {
        recommendation_type: 'financial_health',
        title: 'Set Up Cash Flow Forecasting',
        description: 'Implement monthly cash flow projections to prevent financial surprises.',
        hook: 'Cash flow issues kill 82% of small businesses - stay ahead of the curve',
        priority: 'high',
        expected_impact: 'Avoid cash flow crises',
        time_to_implement: '1-2 weeks',
        reasoning: 'Proactive cash flow management prevents business-threatening financial gaps.',
        complexity: 'simple',
        industries: [profile.profile?.industry],
        business_sizes: [profile.profile?.business_size]
      }
    ];

    return recommendations;
  }

  private async generateMarketingSalesRecommendations(profile: CompleteUserProfile) {
    const recommendations = [
      {
        recommendation_type: 'marketing_sales',
        title: 'Optimize Your Google Business Profile',
        description: 'Complete and regularly update your Google Business Profile to improve local visibility.',
        hook: 'Optimized Google profiles get 5x more views than incomplete ones',
        priority: 'high',
        expected_impact: '+50% local visibility',
        time_to_implement: '1 week',
        reasoning: 'Local search is crucial for service businesses - most customers search locally first.',
        complexity: 'simple',
        industries: [profile.profile?.industry],
        business_sizes: [profile.profile?.business_size]
      }
    ];

    return recommendations;
  }

  // ============= UTILITY METHODS =============

  private calculateRecommendationScore(recommendation: any, profile: CompleteUserProfile): number {
    let score = 0;

    // Base priority score
    const priorityScores = { high: 10, medium: 5, low: 2 };
    score += priorityScores[recommendation.priority] || 0;

    // Business stage relevance (based on chaos score)
    if (profile.quizData?.chaos_contribution) {
      if (profile.quizData.chaos_contribution > 7 && recommendation.complexity === 'simple') {
        score += 5; // High chaos users prefer simple solutions
      } else if (profile.quizData.chaos_contribution < 4 && recommendation.complexity === 'advanced') {
        score += 5; // Low chaos users can handle advanced solutions
      }
    }

    // Industry relevance
    if (recommendation.industries?.includes(profile.profile?.industry)) {
      score += 3;
    }

    // Business size relevance
    if (recommendation.business_sizes?.includes(profile.profile?.business_size)) {
      score += 2;
    }

    return score;
  }

  private async calculateProfileCompleteness(profileData: any): Promise<number> {
    // Calculate completeness based on available data
    if (!profileData) return 0;
    
    const fields = [
      'business_name',
      'industry', 
      'phone',
      'setup_preference',
      'quiz_completed_at'
    ];
    
    const completedFields = fields.filter(field => 
      profileData[field] && profileData[field].toString().trim() !== ''
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
  }

  private async updateUniversalIntelligence(data: any) {
    try {
      await supabase
        .from('unified_business_profiles')
        .upsert({
          user_id: this.userId,
          profile_data: data.profileData || {},
          website_data: data.websiteData || {},
          ai_preferences: data.aiPreferences || {},
          integration_data: data.integrationData || {},
          last_updated: new Date().toISOString()
        });
    } catch (error) {
      console.error('Update universal intelligence failed:', error);
    }
  }

  // ============= BUSINESS METRICS =============

  async recordMetric(metricType: string, value: number, additionalData: any = {}) {
    try {
      await supabase
        .from('business_metrics')
        .insert({
          user_id: this.userId,
          metric_type: metricType,
          value: value,
          context: additionalData
        });
    } catch (error) {
      console.error('Record metric failed:', error);
    }
  }

  async getMetrics(metricType?: string, limit = 100) {
    try {
      let query = supabase
        .from('business_metrics')
        .select('*')
        .eq('user_id', this.userId)
        .order('recorded_at', { ascending: false })
        .limit(limit);

      if (metricType) {
        query = query.eq('metric_type', metricType);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Get metrics failed:', error);
      return [];
    }
  }

  // ============= ENGAGEMENT TRACKING =============

  async trackEngagement(eventType: string, eventData: any = {}, sessionId?: string, pagePath?: string) {
    try {
      await supabase
        .from('user_engagement')
        .insert({
          user_id: this.userId,
          event_type: eventType,
          event_data: eventData,
          session_id: sessionId,
          page_path: pagePath
        });
    } catch (error) {
      console.error('Track engagement failed:', error);
    }
  }
}

// Factory function to create DataManager instances
export const createDataManager = (userId: string) => {
  return new DataManager(userId);
};

// Singleton pattern for current user
let currentDataManager: DataManager | null = null;

export const getCurrentDataManager = (userId?: string) => {
  if (!currentDataManager && userId) {
    currentDataManager = new DataManager(userId);
  }
  return currentDataManager;
};

export const resetDataManager = () => {
  currentDataManager = null;
};