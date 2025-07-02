import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, analysisType = 'recommendations' } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch user business data
    const [profileRes, metricsRes, contactsRes, dealsRes, integrationsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId).single(),
      supabase.from('business_metrics').select('*').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(10),
      supabase.from('crm_contacts').select('*').eq('user_id', userId).limit(50),
      supabase.from('crm_deals').select('*').eq('user_id', userId).limit(20),
      supabase.from('integrations').select('*').eq('user_id', userId).eq('is_active', true)
    ]);

    const profile = profileRes.data;
    const metrics = metricsRes.data || [];
    const contacts = contactsRes.data || [];
    const deals = dealsRes.data || [];
    const integrations = integrationsRes.data || [];

    // Build context for AI analysis
    const businessContext = {
      industry: profile?.industry || 'general business',
      businessName: profile?.business_name || 'your business',
      goals: profile?.business_goals || 'growth and efficiency',
      totalContacts: contacts.length,
      totalDeals: deals.length,
      totalValue: deals.reduce((sum, deal) => sum + (deal.amount || 0), 0),
      highValueDeals: deals.filter(d => (d.amount || 0) > 5000).length,
      recentMetrics: metrics.slice(0, 5),
      activeIntegrations: integrations.map(i => i.provider),
      chaosIndex: metrics.find(m => m.metric_type === 'chaos_index')?.value || 0
    };

    let prompt = '';
    if (analysisType === 'recommendations') {
      prompt = `As a business intelligence AI for ${businessContext.businessName} in the ${businessContext.industry} industry, analyze this data and provide actionable insights:

Business Overview:
- Total Contacts: ${businessContext.totalContacts}
- Active Deals: ${businessContext.totalDeals} (${businessContext.highValueDeals} high-value)
- Pipeline Value: $${businessContext.totalValue}
- Chaos Index: ${businessContext.chaosIndex}/100
- Connected Systems: ${businessContext.activeIntegrations.join(', ') || 'None'}
- Goals: ${businessContext.goals}

Generate 3-5 business intelligence insights that include:
1. Revenue optimization opportunities
2. Operational efficiency improvements
3. Risk alerts or warnings
4. Growth recommendations

Format as JSON array with objects containing:
- insight_type: "revenue_trend" | "efficiency_opportunity" | "risk_alert"
- title: Brief insight title
- description: Detailed analysis
- confidence_score: 0.0-1.0 confidence level
- impact_estimation: Expected business impact
- data_source: What data informed this insight

Focus on actionable, specific recommendations for a ${businessContext.industry} business.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business intelligence analyst specializing in small businesses and tradesmen. Provide actionable, data-driven insights that help businesses grow and operate more efficiently.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;

    // Parse AI response
    let insights;
    try {
      insights = JSON.parse(content);
    } catch (error) {
      // Fallback parsing if AI doesn't return valid JSON
      insights = [{
        insight_type: 'efficiency_opportunity',
        title: 'AI Analysis Complete',
        description: content.substring(0, 500),
        confidence_score: 0.8,
        impact_estimation: 'Medium impact opportunity identified',
        data_source: 'Comprehensive business data analysis'
      }];
    }

    // Store insights in database
    const insightsToStore = insights.map((insight: any) => ({
      user_id: userId,
      insight_type: insight.insight_type,
      title: insight.title,
      description: insight.description,
      confidence_score: insight.confidence_score,
      data_source: insight.data_source,
      impact_estimation: insight.impact_estimation,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    }));

    await supabase
      .from('business_insights')
      .insert(insightsToStore);

    return new Response(JSON.stringify({ 
      success: true, 
      insights,
      context: businessContext 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('AI Business Advisor error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});