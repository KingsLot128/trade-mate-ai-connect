
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch business data for analysis
    const [contactsRes, dealsRes, callsRes, appointmentsRes] = await Promise.all([
      supabase.from('crm_contacts').select('*').eq('user_id', userId),
      supabase.from('crm_deals').select('*').eq('user_id', userId),
      supabase.from('calls').select('*').eq('user_id', userId),
      supabase.from('appointments').select('*').eq('user_id', userId)
    ])

    const contacts = contactsRes.data || []
    const deals = dealsRes.data || []
    const calls = callsRes.data || []
    const appointments = appointmentsRes.data || []

    // Prepare data summary for AI analysis
    const businessData = {
      totalContacts: contacts.length,
      totalDeals: deals.length,
      totalCalls: calls.length,
      totalAppointments: appointments.length,
      avgDealValue: deals.length > 0 ? deals.reduce((sum, deal) => sum + (deal.amount || 0), 0) / deals.length : 0,
      missedCalls: calls.filter(call => call.status === 'missed').length,
      dealStages: deals.reduce((acc, deal) => {
        acc[deal.stage || 'unknown'] = (acc[deal.stage || 'unknown'] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      topLeadScores: contacts.filter(c => c.lead_score > 0).sort((a, b) => b.lead_score - a.lead_score).slice(0, 5),
      recentActivity: {
        newContactsThisWeek: contacts.filter(c => 
          new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        dealsClosedThisMonth: deals.filter(d => 
          d.actual_close_date && new Date(d.actual_close_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length
      }
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `As an AI business consultant, analyze this business data and provide 3-5 actionable insights and recommendations:

Business Data:
- Total Contacts: ${businessData.totalContacts}
- Total Deals: ${businessData.totalDeals} (Avg Value: $${businessData.avgDealValue.toFixed(2)})
- Total Calls: ${businessData.totalCalls} (Missed: ${businessData.missedCalls})
- Total Appointments: ${businessData.totalAppointments}
- Deal Stages: ${JSON.stringify(businessData.dealStages)}
- New Contacts This Week: ${businessData.recentActivity.newContactsThisWeek}
- Deals Closed This Month: ${businessData.recentActivity.dealsClosedThisMonth}

Provide insights in this JSON format:
{
  "insights": [
    {
      "title": "Insight Title",
      "description": "Detailed description",
      "priority": "high|medium|low",
      "category": "sales|marketing|operations|customer_service",
      "actionable_steps": ["Step 1", "Step 2"],
      "potential_impact": "Expected business impact"
    }
  ],
  "summary": "Overall business health summary",
  "recommendations": ["Top 3 immediate actions"]
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business consultant specializing in small business growth, CRM optimization, and sales process improvement. Always provide practical, actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const aiResponse = await response.json()
    const aiContent = aiResponse.choices[0].message.content

    // Parse the AI response
    let insights
    try {
      insights = JSON.parse(aiContent)
    } catch (error) {
      // Fallback if JSON parsing fails
      insights = {
        insights: [{
          title: "AI Analysis Complete",
          description: aiContent,
          priority: "medium",
          category: "general",
          actionable_steps: ["Review the analysis provided"],
          potential_impact: "Improved business understanding"
        }],
        summary: "AI analysis completed successfully",
        recommendations: ["Review insights and take action"]
      }
    }

    // Store insights in database for history
    await supabase.from('automation_events').insert({
      user_id: userId,
      event_type: 'ai_insights_generated',
      event_data: {
        insights: insights,
        business_data: businessData,
        generated_at: new Date().toISOString()
      }
    })

    return new Response(
      JSON.stringify(insights),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('AI Insights error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
