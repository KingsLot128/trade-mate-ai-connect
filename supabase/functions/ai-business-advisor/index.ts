import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

    const { analysisType = 'recommendations', userId } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch comprehensive business data for analysis
    const [contactsRes, dealsRes, callsRes, appointmentsRes, profileRes, settingsRes, metricsRes, preferencesRes] = await Promise.all([
      supabase.from('crm_contacts').select('*').eq('user_id', userId),
      supabase.from('crm_deals').select('*').eq('user_id', userId),
      supabase.from('calls').select('*').eq('user_id', userId),
      supabase.from('appointments').select('*').eq('user_id', userId),
      supabase.from('profiles').select('*').eq('user_id', userId).single(),
      supabase.from('business_settings').select('*').eq('user_id', userId).single(),
      supabase.from('business_metrics').select('*').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(30),
      supabase.from('ai_preferences').select('*').eq('user_id', userId).single()
    ]);

    const contacts = contactsRes.data || [];
    const deals = dealsRes.data || [];
    const calls = callsRes.data || [];
    const appointments = appointmentsRes.data || [];
    const profile = profileRes.data;
    const settings = settingsRes.data;
    const metrics = metricsRes.data || [];
    const preferences = preferencesRes.data;

    // Advanced business data analysis
    const businessData = {
      // Basic metrics
      totalContacts: contacts.length,
      totalDeals: deals.length,
      totalCalls: calls.length,
      totalAppointments: appointments.length,
      
      // Business profile
      industry: profile?.industry || 'unknown',
      businessSize: profile?.business_size || 'unknown',
      yearsInBusiness: profile?.years_in_business || 0,
      chaosScore: profile?.chaos_score || 0,
      businessHealthScore: profile?.business_health_score || 0,
      
      // Financial metrics
      avgDealValue: deals.length > 0 ? deals.reduce((sum, deal) => sum + (deal.amount || 0), 0) / deals.length : 0,
      totalRevenue: deals.filter(d => d.actual_close_date).reduce((sum, deal) => sum + (deal.amount || 0), 0),
      pipelineValue: deals.filter(d => !d.actual_close_date).reduce((sum, deal) => sum + (deal.amount || 0), 0),
      
      // Performance metrics
      missedCalls: calls.filter(call => call.status === 'missed').length,
      callConversionRate: calls.length > 0 ? (appointments.length / calls.length) * 100 : 0,
      dealCloseRate: deals.length > 0 ? (deals.filter(d => d.actual_close_date).length / deals.length) * 100 : 0,
      
      // Stage analysis
      dealStages: deals.reduce((acc, deal) => {
        acc[deal.stage || 'unknown'] = (acc[deal.stage || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      
      // Lead quality
      topLeadScores: contacts.filter(c => c.lead_score > 0).sort((a, b) => b.lead_score - a.lead_score).slice(0, 5),
      avgLeadScore: contacts.length > 0 ? contacts.reduce((sum, c) => sum + (c.lead_score || 0), 0) / contacts.length : 0,
      
      // Recent activity trends
      recentActivity: {
        newContactsThisWeek: contacts.filter(c => 
          new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        dealsClosedThisMonth: deals.filter(d => 
          d.actual_close_date && new Date(d.actual_close_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        callsThisWeek: calls.filter(c => 
          new Date(c.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        appointmentsThisWeek: appointments.filter(a => 
          new Date(a.scheduled_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length
      },
      
      // AI preferences for personalization
      aiPreferences: {
        frequency: preferences?.frequency || 'daily',
        focusAreas: preferences?.focus_areas || [],
        complexity: preferences?.complexity || 'moderate'
      },
      
      // Business metrics trends
      recentMetrics: metrics.map(m => ({
        type: m.metric_type,
        value: m.value,
        date: m.recorded_at
      }))
    };

    // Create intelligent, personalized prompt based on analysis type and preferences
    const getAnalysisPrompt = () => {
      const baseContext = `
Business Profile:
- Industry: ${businessData.industry}
- Business Size: ${businessData.businessSize}
- Years in Business: ${businessData.yearsInBusiness}
- Chaos Score: ${businessData.chaosScore}/100 (lower is better)
- Business Health Score: ${businessData.businessHealthScore}/100

Performance Metrics:
- Total Contacts: ${businessData.totalContacts}
- Total Deals: ${businessData.totalDeals} (Avg Value: $${businessData.avgDealValue.toFixed(2)})
- Total Revenue: $${businessData.totalRevenue.toFixed(2)}
- Pipeline Value: $${businessData.pipelineValue.toFixed(2)}
- Total Calls: ${businessData.totalCalls} (Missed: ${businessData.missedCalls})
- Call → Appointment Rate: ${businessData.callConversionRate.toFixed(1)}%
- Deal Close Rate: ${businessData.dealCloseRate.toFixed(1)}%
- Average Lead Score: ${businessData.avgLeadScore.toFixed(1)}

Recent Activity:
- New Contacts This Week: ${businessData.recentActivity.newContactsThisWeek}
- Deals Closed This Month: ${businessData.recentActivity.dealsClosedThisMonth}
- Calls This Week: ${businessData.recentActivity.callsThisWeek}
- Appointments This Week: ${businessData.recentActivity.appointmentsThisWeek}

AI Preferences:
- Focus Areas: ${businessData.aiPreferences.focusAreas.join(', ')}
- Complexity Level: ${businessData.aiPreferences.complexity}
- Update Frequency: ${businessData.aiPreferences.frequency}
`;

      if (analysisType === 'insights') {
        return `${baseContext}

As a senior business consultant specializing in ${businessData.industry} businesses, analyze this data and provide 3-5 deep insights with specific recommendations. Focus on identifying patterns, opportunities, and potential risks.

Response Format:
{
  "insights": [
    {
      "title": "Clear, specific insight title",
      "description": "Detailed analysis with specific numbers and context",
      "priority": "high|medium|low",
      "category": "sales|marketing|operations|customer_service|financial",
      "actionable_steps": ["Specific action 1", "Specific action 2", "Specific action 3"],
      "potential_impact": "Quantified expected impact (revenue, efficiency, etc.)",
      "timeframe": "immediate|week|month|quarter",
      "difficulty": "easy|moderate|challenging"
    }
  ],
  "summary": "Executive summary of business health and key opportunities",
  "recommendations": ["Top 3 immediate priority actions"]
}`;
      }

      return `${baseContext}

As an expert business advisor for ${businessData.industry} companies, create personalized recommendations that address the biggest opportunities based on this data. Consider the business's current chaos score and focus on ${businessData.aiPreferences.complexity} complexity solutions.

Response Format:
{
  "insights": [
    {
      "title": "Actionable recommendation title",
      "description": "Why this recommendation matters for this specific business",
      "priority": "high|medium|low",
      "category": "sales|marketing|operations|customer_service|financial|systems",
      "actionable_steps": ["Step 1 with specific details", "Step 2 with timeline", "Step 3 with success metrics"],
      "potential_impact": "Expected business outcome with estimated numbers",
      "timeframe": "immediate|week|month|quarter",
      "difficulty": "easy|moderate|challenging",
      "success_metrics": ["Metric 1", "Metric 2"]
    }
  ],
  "summary": "Current business status and growth trajectory",
  "recommendations": ["Top 3 highest-impact actions for immediate implementation"]
}`;
    };

    const prompt = getAnalysisPrompt();
    
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
            content: `You are TradeMate AI's senior business consultant with deep expertise in ${businessData.industry} businesses. You specialize in:
- Small business growth strategies and operations optimization
- CRM and sales process improvement
- Industry-specific best practices for ${businessData.industry}
- Data-driven decision making and performance improvement
- Chaos reduction and systems implementation

Your responses are always practical, actionable, and tailored to the specific business context. You provide specific numbers, timelines, and success metrics. You understand that ${businessData.aiPreferences.complexity} complexity solutions work best for this user.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices[0].message.content;

    // Parse the AI response
    let insights;
    try {
      insights = JSON.parse(aiContent);
    } catch (error) {
      // Fallback if JSON parsing fails
      insights = {
        insights: [{
          title: "AI Analysis Complete",
          description: aiContent,
          priority: "medium",
          category: "general",
          actionable_steps: ["Review the analysis provided"],
          potential_impact: "Improved business understanding",
          timeframe: "week",
          difficulty: "moderate"
        }],
        summary: "AI analysis completed successfully",
        recommendations: ["Review insights and take action"]
      };
    }

    // Store insights in multiple tables for comprehensive tracking
    await Promise.all([
      // Store in automation events for history
      supabase.from('automation_events').insert({
        user_id: userId,
        event_type: 'ai_insights_generated',
        event_data: {
          insights: insights,
          business_data: businessData,
          analysis_type: analysisType,
          generated_at: new Date().toISOString()
        }
      }),
      
      // Store enhanced recommendations for the feed system
      ...insights.insights.map((insight: any, index: number) => 
        supabase.from('enhanced_recommendations').insert({
          user_id: userId,
          recommendation_id: `ai-${analysisType}-${Date.now()}-${index}`,
          recommendation_type: insight.category,
          hook: insight.title,
          reasoning: insight.description,
          content: {
            title: insight.title,
            description: insight.description,
            actionable_steps: insight.actionable_steps,
            potential_impact: insight.potential_impact,
            timeframe: insight.timeframe || 'week',
            difficulty: insight.difficulty || 'moderate',
            success_metrics: insight.success_metrics || []
          },
          expected_impact: insight.potential_impact,
          time_to_implement: insight.timeframe || 'week',
          priority_score: insight.priority === 'high' ? 85 : insight.priority === 'medium' ? 65 : 45,
          personalized_score: 80,
          confidence_score: 85,
          stream_type: 'forYou'
        })
      )
    ]);

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Business Advisor Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});