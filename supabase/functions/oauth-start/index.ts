
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
    const { provider, redirectUrl } = await req.json()
    
    // OAuth URLs for different providers
    const oauthConfigs = {
      hubspot: {
        baseUrl: 'https://app.hubspot.com/oauth/authorize',
        clientId: Deno.env.get('HUBSPOT_CLIENT_ID'),
        scopes: 'contacts%20deals%20tickets%20automation'
      },
      salesforce: {
        baseUrl: 'https://login.salesforce.com/services/oauth2/authorize',
        clientId: Deno.env.get('SALESFORCE_CLIENT_ID'),
        scopes: 'api%20refresh_token'
      },
      quickbooks: {
        baseUrl: 'https://appcenter.intuit.com/connect/oauth2',
        clientId: Deno.env.get('QUICKBOOKS_CLIENT_ID'),
        scopes: 'com.intuit.quickbooks.accounting'
      }
    }

    const config = oauthConfigs[provider as keyof typeof oauthConfigs]
    if (!config) {
      throw new Error(`Unsupported provider: ${provider}`)
    }

    // Generate state parameter for security
    const state = crypto.randomUUID()
    
    // Store state in Supabase for validation
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Build OAuth URL
    const oauthUrl = new URL(config.baseUrl)
    oauthUrl.searchParams.set('client_id', config.clientId!)
    oauthUrl.searchParams.set('redirect_uri', redirectUrl)
    oauthUrl.searchParams.set('scope', config.scopes)
    oauthUrl.searchParams.set('response_type', 'code')
    oauthUrl.searchParams.set('state', `${provider}:${state}`)

    return new Response(
      JSON.stringify({ oauthUrl: oauthUrl.toString(), state }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('OAuth start error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
