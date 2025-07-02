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
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 1. Fetch user's business context
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: quizResponses } = await supabase
      .from('user_quiz_responses')
      .select('*')
      .eq('user_id', userId);

    const { data: chaosMetric } = await supabase
      .from('business_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('metric_type', 'chaos_index')
      .order('recorded_at', { ascending: false })
      .limit(1);

    // 2. Build context for AI
    const businessContext = {
      industry: profile?.industry || 'general',
      businessName: profile?.business_name || 'Business',
      chaosIndex: chaosMetric?.[0]?.value || 0,
      challenges: quizResponses?.find(r => r.question_id === 'business_challenges')?.response || [],
      revenueRange: quizResponses?.find(r => r.question_id === 'monthly_revenue')?.response || 'unknown',
      currentTools: quizResponses?.find(r => r.question_id === 'current_tools')?.response || [],
      revenueTarget: quizResponses?.find(r => r.question_id === 'revenue_target')?.response || '',
      efficiencyGoal: quizResponses?.find(r => r.question_id === 'efficiency_goal')?.response || ''
    };

    // 3. Generate AI decisions
    const prompt = `You are an AI business advisor for tradespeople and solopreneurs. Generate 3-5 specific, actionable daily recommendations for this business:

Business Context:
- Industry: ${businessContext.industry}
- Business Name: ${businessContext.businessName}
- Chaos Index: ${businessContext.chaosIndex}/10 (higher = more operational chaos)
- Primary Challenges: ${JSON.stringify(businessContext.challenges)}
- Monthly Revenue Range: ${businessContext.revenueRange}
- Current Tools: ${JSON.stringify(businessContext.currentTools)}
- Revenue Target: ${businessContext.revenueTarget}
- Efficiency Goal: ${businessContext.efficiencyGoal}

Generate recommendations in this exact JSON format:
{
  "decisions": [
    {
      "type": "revenue|efficiency|communication|risk",
      "title": "Clear, actionable title (max 50 chars)",
      "description": "Detailed description with specific steps",
      "impact": "high|medium|low",
      "timeToImplement": "5 minutes|30 minutes|1 hour|This week",
      "estimatedValue": "Specific value like '$500 potential revenue' or '2 hours saved weekly'",
      "reasoning": "Brief explanation of why this helps their specific situation",
      "priority": 1-5
    }
  ]
}

Rules:
- Make recommendations specific to their industry and chaos level
- Focus on high-impact, achievable actions
- If chaos index > 6, prioritize efficiency and organization
- If chaos index < 4, focus on growth and revenue
- Include at least one immediate action (5-30 minutes)
- Make estimated values realistic and specific
- Keep total to 3-5 recommendations`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert business advisor for tradespeople. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    const aiResponse = await response.json();
    const decisionsData = JSON.parse(aiResponse.choices[0].message.content);

    // 4. Store decisions in database
    const decisionsToInsert = decisionsData.decisions.map((decision: any) => ({
      user_id: userId,
      decision_type: decision.type,
      title: decision.title,
      description: decision.description,
      impact: decision.impact,
      time_to_implement: decision.timeToImplement,
      estimated_value: decision.estimatedValue,
      reasoning: decision.reasoning,
      priority: decision.priority
    }));

    // Clear previous pending decisions for today
    await supabase
      .from('ai_decisions')
      .delete()
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gte('created_at', new Date().toISOString().split('T')[0]);

    // Insert new decisions
    const { data: insertedDecisions, error: insertError } = await supabase
      .from('ai_decisions')
      .insert(decisionsToInsert)
      .select();

    if (insertError) {
      throw insertError;
    }

    // 5. Generate business insights for Clarity Lens
    const insightsPrompt = `Based on the same business context, generate 2-3 business intelligence insights in this JSON format:
{
  "insights": [
    {
      "type": "revenue_trend|efficiency_opportunity|risk_alert|growth_opportunity",
      "title": "Insight title",
      "description": "Detailed insight with data-driven reasoning",
      "confidenceScore": 0.85,
      "impactEstimation": "Potential impact description"
    }
  ]
}

Focus on patterns, trends, and opportunities specific to ${businessContext.industry} businesses.`;

    const insightsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a business intelligence analyst. Always respond with valid JSON.' },
          { role: 'user', content: insightsPrompt }
        ],
        temperature: 0.6,
        max_tokens: 1500
      }),
    });

    const insightsAiResponse = await insightsResponse.json();
    const insightsData = JSON.parse(insightsAiResponse.choices[0].message.content);

    // Store insights
    const insightsToInsert = insightsData.insights.map((insight: any) => ({
      user_id: userId,
      insight_type: insight.type,
      title: insight.title,
      description: insight.description,
      confidence_score: insight.confidenceScore,
      impact_estimation: insight.impactEstimation,
      data_source: businessContext,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    }));

    await supabase
      .from('business_insights')
      .insert(insightsToInsert);

    return new Response(
      JSON.stringify({
        decisions: insertedDecisions,
        insights: insightsData.insights,
        message: 'Daily decisions and insights generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating daily decisions:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});