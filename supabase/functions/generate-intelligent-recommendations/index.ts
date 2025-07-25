import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserProfile {
  user_id: string;
  business_name: string;
  industry: string;
  chaos_score: number;
  clarity_zone: string;
  business_health_score: number;
}

interface BusinessData {
  customers: any[];
  metrics: any[];
  appointments: any[];
  deals: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    
    if (!user_id) {
      throw new Error('User ID is required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch user profile and business data
    const [profileRes, customersRes, metricsRes, appointmentsRes, dealsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user_id).single(),
      supabase.from('customers').select('*').eq('user_id', user_id),
      supabase.from('business_metrics').select('*').eq('user_id', user_id),
      supabase.from('appointments').select('*').eq('user_id', user_id),
      supabase.from('crm_deals').select('*').eq('user_id', user_id)
    ]);

    const profile: UserProfile = profileRes.data;
    const businessData: BusinessData = {
      customers: customersRes.data || [],
      metrics: metricsRes.data || [],
      appointments: appointmentsRes.data || [],
      deals: dealsRes.data || []
    };

    // Generate contextual recommendations and decisions
    const recommendations = await generateIntelligentRecommendations(profile, businessData);
    const decisions = await generateDailyDecisions(profile, businessData);

    // Store recommendations in database
    if (recommendations.length > 0) {
      const enhancedRecommendations = recommendations.map(rec => ({
        user_id: user_id,
        recommendation_id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        recommendation_type: rec.category,
        hook: rec.title,
        reasoning: rec.description,
        content: rec.content,
        priority_score: rec.priority_score,
        confidence_score: rec.confidence_score,
        expected_impact: rec.expected_impact,
        time_to_implement: rec.time_to_implement,
        stream_type: 'forYou',
        is_active: true
      }));

      await supabase.from('enhanced_recommendations').insert(enhancedRecommendations);
    }

    // Store decisions in database
    if (decisions.length > 0) {
      const aiDecisions = decisions.map(decision => ({
        user_id: user_id,
        decision_type: decision.type,
        title: decision.title,
        description: decision.description,
        impact: decision.impact,
        priority: decision.priority,
        time_to_implement: decision.timeframe,
        estimated_value: decision.estimated_value,
        reasoning: decision.reasoning,
        scheduled_for: new Date().toISOString().split('T')[0], // Today
        status: 'pending'
      }));

      await supabase.from('ai_decisions').insert(aiDecisions);
    }

    return new Response(JSON.stringify({
      success: true,
      recommendations_generated: recommendations.length,
      decisions_generated: decisions.length,
      message: 'AI recommendations and decisions generated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateIntelligentRecommendations(profile: UserProfile, data: BusinessData) {
  const recommendations = [];

  // Customer Growth Analysis
  if (data.customers.length < 15) {
    recommendations.push({
      title: 'Accelerate Customer Acquisition',
      description: `Your customer base of ${data.customers.length} customers has strong growth potential. Focus on digital marketing to expand reach.`,
      category: 'growth',
      priority_score: 90,
      confidence_score: 85,
      expected_impact: 'High - 25-40% increase in leads',
      time_to_implement: '2-3 weeks',
      content: {
        actionable_steps: [
          'Optimize Google Business Profile for local search',
          'Launch targeted social media campaigns',
          'Implement referral program for existing customers',
          'Create content marketing strategy for your industry'
        ],
        success_metrics: [
          'Increase in qualified leads per month',
          'Improvement in local search rankings',
          'Higher conversion rate from digital channels',
          'Growth in social media engagement'
        ],
        timeframe: '2-3 weeks',
        difficulty: 'moderate'
      }
    });
  }

  // Chaos Management
  if (profile.chaos_score > 70) {
    recommendations.push({
      title: 'Implement Chaos Reduction System',
      description: `Your chaos score of ${profile.chaos_score} indicates high operational stress. Streamline workflows to improve efficiency.`,
      category: 'operations',
      priority_score: 95,
      confidence_score: 90,
      expected_impact: 'High - 30-50% stress reduction',
      time_to_implement: '1-2 weeks',
      content: {
        actionable_steps: [
          'Create daily task prioritization system',
          'Implement customer communication templates',
          'Set up automated appointment reminders',
          'Establish clear service delivery checklists'
        ],
        success_metrics: [
          'Reduction in daily chaos score',
          'Improved on-time service delivery',
          'Better customer satisfaction ratings',
          'Increased personal productivity'
        ],
        timeframe: '1-2 weeks',
        difficulty: 'easy'
      }
    });
  }

  // Revenue Optimization
  const hasRevenueData = data.metrics.some(m => m.metric_type === 'monthly_revenue');
  if (!hasRevenueData && data.customers.length > 5) {
    recommendations.push({
      title: 'Establish Revenue Tracking & Pricing Strategy',
      description: 'With a solid customer base, implementing systematic revenue tracking will unlock pricing optimization opportunities.',
      category: 'financial',
      priority_score: 80,
      confidence_score: 85,
      expected_impact: 'Medium - 15-25% profit increase',
      time_to_implement: '1 week',
      content: {
        actionable_steps: [
          'Set up monthly revenue tracking system',
          'Analyze profitability by service type',
          'Benchmark pricing against local competitors',
          'Create tiered service packages'
        ],
        success_metrics: [
          'Monthly revenue growth percentage',
          'Profit margin improvement',
          'Better cash flow predictability',
          'Increased average project value'
        ],
        timeframe: '1 week',
        difficulty: 'easy'
      }
    });
  }

  // Industry-Specific Recommendations
  if (profile.industry === 'Landscaping') {
    const seasonalRecommendation = {
      title: 'Develop Year-Round Revenue Streams',
      description: 'Landscaping businesses can maximize revenue by offering complementary services across all seasons.',
      category: 'strategy',
      priority_score: 75,
      confidence_score: 80,
      expected_impact: 'Medium - 20-30% annual revenue increase',
      time_to_implement: '3-4 weeks',
      content: {
        actionable_steps: [
          'Package spring cleanup and garden design services',
          'Offer summer maintenance contracts',
          'Create fall preparation and winter planning services',
          'Develop holiday lighting installation packages'
        ],
        success_metrics: [
          'Off-season revenue generation',
          'Contract retention rates',
          'Customer lifetime value increase',
          'Seasonal service adoption rates'
        ],
        timeframe: '3-4 weeks',
        difficulty: 'moderate'
      }
    };
    recommendations.push(seasonalRecommendation);
  }

  return recommendations;
}

async function generateDailyDecisions(profile: UserProfile, data: BusinessData) {
  const decisions = [];
  const today = new Date();

  // Urgent Customer Follow-up
  const urgentCustomers = data.customers.filter(c => 
    c.timeline_urgency === 'ASAP' || c.relationship_stage === 'Hot Lead'
  );

  if (urgentCustomers.length > 0) {
    decisions.push({
      type: 'customer_action',
      title: `Follow up with ${urgentCustomers.length} urgent customers`,
      description: `You have ${urgentCustomers.length} customers requiring immediate attention. Prioritize these to avoid losing opportunities.`,
      impact: 'high',
      priority: 1,
      timeframe: 'Today',
      estimated_value: '$2,000 - $8,000',
      reasoning: 'Quick response to urgent customers significantly improves conversion rates and customer satisfaction.'
    });
  }

  // Business Health Check
  if (profile.chaos_score > 80) {
    decisions.push({
      type: 'operational',
      title: 'Emergency Workflow Organization',
      description: 'Your high chaos score requires immediate attention to prevent business disruption.',
      impact: 'high',
      priority: 1,
      timeframe: 'Today',
      estimated_value: 'Stress reduction + productivity gain',
      reasoning: 'Addressing operational chaos immediately prevents customer service issues and personal burnout.'
    });
  }

  // Revenue Opportunity
  const recentCustomers = data.customers.filter(c => {
    const createdDate = new Date(c.created_at);
    const daysDiff = (today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff >= 30 && daysDiff <= 45;
  });

  if (recentCustomers.length > 0) {
    decisions.push({
      type: 'revenue',
      title: 'Reach out for follow-up services',
      description: `${recentCustomers.length} customers from last month may need additional services or maintenance.`,
      impact: 'medium',
      priority: 2,
      timeframe: 'This week',
      estimated_value: '$1,500 - $5,000',
      reasoning: 'Follow-up services have high conversion rates and strengthen customer relationships.'
    });
  }

  return decisions;
}