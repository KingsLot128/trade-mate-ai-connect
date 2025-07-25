
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code, state, userId } = await req.json()
    
    if (!code || !state || !userId) {
      throw new Error('Missing required parameters')
    }

    const [provider] = state.split(':')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Exchange code for tokens based on provider
    let tokenData
    
    if (provider === 'hubspot') {
      const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: Deno.env.get('HUBSPOT_CLIENT_ID')!,
          client_secret: Deno.env.get('HUBSPOT_CLIENT_SECRET')!,
          redirect_uri: req.headers.get('referer') || '',
          code
        })
      })
      tokenData = await tokenResponse.json()
    } else if (provider === 'salesforce') {
      const tokenResponse = await fetch('https://login.salesforce.com/services/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: Deno.env.get('SALESFORCE_CLIENT_ID')!,
          client_secret: Deno.env.get('SALESFORCE_CLIENT_SECRET')!,
          redirect_uri: req.headers.get('referer') || '',
          code
        })
      })
      tokenData = await tokenResponse.json()
    } else if (provider === 'quickbooks') {
      const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
        method: 'POST',
        headers: { 
          'Authorization': `Basic ${btoa(`${Deno.env.get('QUICKBOOKS_CLIENT_ID')}:${Deno.env.get('QUICKBOOKS_CLIENT_SECRET')}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: req.headers.get('referer') || ''
        })
      })
      tokenData = await tokenResponse.json()
    } else if (provider === 'google_calendar') {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
          redirect_uri: req.headers.get('referer') || '',
          code
        })
      })
      tokenData = await tokenResponse.json()
    } else if (provider === 'stripe') {
      const tokenResponse = await fetch('https://connect.stripe.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: Deno.env.get('STRIPE_CLIENT_ID')!,
          client_secret: Deno.env.get('STRIPE_CLIENT_SECRET')!,
          code
        })
      })
      tokenData = await tokenResponse.json()
    }

    if (tokenData?.error) {
      throw new Error(tokenData.error_description || tokenData.error)
    }

    // Store integration in database
    const { data: integration, error } = await supabase
      .from('integrations')
      .upsert({
        user_id: userId,
        provider,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
        is_active: true,
        settings: { scope: tokenData.scope }
      }, {
        onConflict: 'user_id,provider'
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return new Response(
      JSON.stringify({ success: true, integration }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('OAuth callback error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
