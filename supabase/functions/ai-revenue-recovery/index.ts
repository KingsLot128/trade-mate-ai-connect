import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { userId } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔍 Starting revenue recovery analysis for user:', userId);

    // Fetch user data for analysis
    const [
      { data: customers },
      { data: deals },
      { data: calls },
      { data: profile }
    ] = await Promise.all([
      supabase.from('customers').select('*').eq('user_id', userId),
      supabase.from('crm_deals').select('*').eq('user_id', userId),
      supabase.from('calls').select('*').eq('user_id', userId),
      supabase.from('profiles').select('*').eq('user_id', userId).single()
    ]);

    // Analyze data for revenue opportunities
    const pendingDeals = deals?.filter(d => ['proposal', 'negotiation'].includes(d.stage?.toLowerCase() || '')) || [];
    const recentCustomers = customers?.filter(c => 
      new Date(c.created_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    ) || [];
    const oldCustomers = customers?.filter(c => 
      new Date(c.created_at) < new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    ) || [];

    console.log('📊 Analysis data:', {
      totalCustomers: customers?.length || 0,
      pendingDeals: pendingDeals.length,
      recentCustomers: recentCustomers.length,
      oldCustomers: oldCustomers.length
    });

    const analysisPrompt = `As an AI revenue recovery specialist for ${profile?.industry || 'trade'} businesses, analyze this data and identify revenue opportunities:

BUSINESS CONTEXT:
- Industry: ${profile?.industry || 'General Trade'}
- Business Level: ${profile?.business_level || 1}
- Total Customers: ${customers?.length || 0}
- Active Deals: ${pendingDeals.length}

PENDING OPPORTUNITIES:
${pendingDeals.map(d => `- Deal: ${d.name} ($${d.amount || 0}) - Stage: ${d.stage} - Created: ${d.created_at}`).join('\n')}

RECENT CUSTOMERS (Last 90 days):
${recentCustomers.slice(0, 10).map(c => `- ${c.name} - Service: ${c.service_type} - Value: $${c.project_value_min}-${c.project_value_max}`).join('\n')}

OLDER CUSTOMERS (6+ months):
${oldCustomers.slice(0, 10).map(c => `- ${c.name} - Service: ${c.service_type} - Last Contact: ${c.created_at}`).join('\n')}

Identify 5-10 specific revenue recovery opportunities in this exact JSON format:

{
  "opportunities": [
    {
      "type": "quote_followup|maintenance_due|upsell|cross_sell|churn_prevention",
      "customer_name": "Customer Name",
      "title": "Brief opportunity title",
      "description": "Detailed description of the opportunity",
      "estimated_value": 1500,
      "confidence_score": 85,
      "priority": "high|medium|low",
      "follow_up_action": "Specific next step to take",
      "timeline": "When to act (e.g., 'within 7 days')"
    }
  ],
  "summary": "Overall analysis summary",
  "total_potential_revenue": 15000
}

Focus on:
1. Quote follow-ups for pending deals
2. Maintenance opportunities for older customers
3. Upselling/cross-selling based on service history
4. Re-engagement for inactive customers
5. Seasonal service reminders`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an expert revenue recovery AI for trade businesses. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices[0].message.content;

    console.log('🤖 AI Response received');

    let analysisData;
    try {
      analysisData = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format');
    }

    // Save opportunities to database
    const opportunitiesToSave = analysisData.opportunities?.map((opp: any) => ({
      user_id: userId,
      opportunity_type: opp.type,
      customer_id: customers?.find(c => c.name === opp.customer_name)?.id || null,
      title: opp.title,
      description: opp.description,
      estimated_value: opp.estimated_value,
      confidence_score: opp.confidence_score,
      priority: opp.priority,
      ai_analysis: {
        follow_up_action: opp.follow_up_action,
        timeline: opp.timeline,
        analysis_date: new Date().toISOString()
      },
      follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 7 days from now
    })) || [];

    if (opportunitiesToSave.length > 0) {
      const { error: insertError } = await supabase
        .from('revenue_opportunities')
        .insert(opportunitiesToSave);

      if (insertError) {
        console.error('Error saving opportunities:', insertError);
        throw insertError;
      }
    }

    console.log('✅ Revenue analysis complete:', {
      opportunities_found: opportunitiesToSave.length,
      total_potential: analysisData.total_potential_revenue
    });

    return new Response(JSON.stringify({
      success: true,
      opportunities_generated: opportunitiesToSave.length,
      total_potential_revenue: analysisData.total_potential_revenue,
      summary: analysisData.summary,
      data: analysisData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-revenue-recovery function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});