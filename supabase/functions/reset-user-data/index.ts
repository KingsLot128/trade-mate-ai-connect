import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🔄 Resetting data for user:', userId);

    // Delete all user data from various tables
    const deleteOperations = [
      // CRM data
      supabase.from('customers').delete().eq('user_id', userId),
      supabase.from('crm_contacts').delete().eq('user_id', userId),
      supabase.from('crm_deals').delete().eq('user_id', userId),
      supabase.from('crm_invoices').delete().eq('user_id', userId),
      
      // AI and recommendations
      supabase.from('ai_decisions').delete().eq('user_id', userId),
      supabase.from('ai_recommendations').delete().eq('user_id', userId),
      supabase.from('business_insights').delete().eq('user_id', userId),
      supabase.from('enhanced_recommendations').delete().eq('user_id', userId),
      
      // Business metrics and opportunities
      supabase.from('business_metrics').delete().eq('user_id', userId),
      supabase.from('revenue_opportunities').delete().eq('user_id', userId),
      
      // Email data
      supabase.from('email_accounts').delete().eq('user_id', userId),
      supabase.from('email_conversations').delete().eq('user_id', userId),
      supabase.from('email_drafts').delete().eq('user_id', userId),
      supabase.from('email_insights').delete().eq('user_id', userId),
      
      // Other user-specific data
      supabase.from('calls').delete().eq('user_id', userId),
      supabase.from('appointments').delete().eq('user_id', userId),
      supabase.from('follow_up_actions').delete().eq('user_id', userId),
      supabase.from('integrations').delete().eq('user_id', userId),
      supabase.from('clarity_points').delete().eq('user_id', userId),
      supabase.from('recommendation_interactions').delete().eq('user_id', userId),
      supabase.from('decision_interactions').delete().eq('user_id', userId),
      supabase.from('dashboard_preferences').delete().eq('user_id', userId),
      supabase.from('custom_widgets').delete().eq('user_id', userId),
    ];

    // Execute all delete operations
    const deleteResults = await Promise.allSettled(deleteOperations);
    
    // Log any errors but don't fail the operation
    deleteResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`Delete operation ${index} failed:`, result.reason);
      }
    });

    // Reset profile data to initial state
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        onboarding_step: 'not_started',
        chaos_score: null,
        business_health_score: 0,
        quiz_completed_at: null,
        clarity_zone: null,
        has_completed_tour: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (profileError) {
      console.error('Error resetting profile:', profileError);
      throw profileError;
    }

    console.log('✅ Successfully reset user data for:', userId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User data has been reset successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error resetting user data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to reset user data',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
