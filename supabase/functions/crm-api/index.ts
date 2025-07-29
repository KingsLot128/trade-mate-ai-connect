import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
}

interface APIRequest {
  action: string;
  data?: any;
  userId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify API key and get associated user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: apiKeyData, error: keyError } = await supabase
      .from('api_keys')
      .select('user_id, permissions')
      .eq('key_hash', apiKey)
      .eq('is_active', true)
      .single();

    if (keyError || !apiKeyData) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, data, userId } = await req.json() as APIRequest;
    const targetUserId = userId || apiKeyData.user_id;

    let result;

    switch (action) {
      case 'sync_profile':
        result = await syncProfile(supabase, targetUserId, data);
        break;
      
      case 'get_profile':
        result = await getProfile(supabase, targetUserId);
        break;
      
      case 'sync_contacts':
        result = await syncContacts(supabase, targetUserId, data);
        break;
      
      case 'get_contacts':
        result = await getContacts(supabase, targetUserId);
        break;
      
      case 'sync_deals':
        result = await syncDeals(supabase, targetUserId, data);
        break;
      
      case 'get_deals':
        result = await getDeals(supabase, targetUserId);
        break;
      
      case 'trigger_onboarding':
        result = await triggerOnboarding(supabase, targetUserId, data);
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('CRM API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function syncProfile(supabase: any, userId: string, profileData: any) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      user_id: userId,
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return { success: true, profile: data };
}

async function getProfile(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return { profile: data };
}

async function syncContacts(supabase: any, userId: string, contacts: any[]) {
  const contactsWithUserId = contacts.map(contact => ({
    ...contact,
    user_id: userId,
    updated_at: new Date().toISOString()
  }));

  const { data, error } = await supabase
    .from('crm_contacts')
    .upsert(contactsWithUserId, { onConflict: 'external_id,user_id' })
    .select();

  if (error) throw error;
  return { success: true, contacts: data };
}

async function getContacts(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { contacts: data };
}

async function syncDeals(supabase: any, userId: string, deals: any[]) {
  const dealsWithUserId = deals.map(deal => ({
    ...deal,
    user_id: userId,
    updated_at: new Date().toISOString()
  }));

  const { data, error } = await supabase
    .from('crm_deals')
    .upsert(dealsWithUserId, { onConflict: 'external_id,user_id' })
    .select();

  if (error) throw error;
  return { success: true, deals: data };
}

async function getDeals(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('crm_deals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { deals: data };
}

async function triggerOnboarding(supabase: any, userId: string, onboardingData: any) {
  // Update user profile with onboarding data
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      onboarding_step: 'in_progress',
      setup_preference: onboardingData.setupPreference || 'minimal',
      ...onboardingData.profileData
    })
    .eq('user_id', userId);

  if (profileError) throw profileError;

  // Trigger AI analysis
  const { data, error } = await supabase.functions.invoke('ai-business-advisor', {
    body: { userId, onboardingData }
  });

  if (error) throw error;

  return { success: true, onboarding: data };
}