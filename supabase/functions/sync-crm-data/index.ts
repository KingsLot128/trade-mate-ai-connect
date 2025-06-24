
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
    const { userId, provider } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get integration
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .eq('is_active', true)
      .single()

    if (integrationError || !integration) {
      throw new Error('Integration not found or inactive')
    }

    let syncResults = { contacts: 0, deals: 0, invoices: 0 }

    if (provider === 'hubspot') {
      // Sync HubSpot contacts
      const contactsResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        headers: { 'Authorization': `Bearer ${integration.access_token}` }
      })
      
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json()
        
        for (const contact of contactsData.results || []) {
          const { error } = await supabase
            .from('crm_contacts')
            .upsert({
              user_id: userId,
              integration_id: integration.id,
              external_id: contact.id,
              name: `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim(),
              email: contact.properties.email,
              phone: contact.properties.phone,
              company: contact.properties.company,
              status: contact.properties.lifecyclestage === 'customer' ? 'customer' : 'prospect',
              last_contact_date: contact.properties.lastmodifieddate
            }, {
              onConflict: 'integration_id,external_id'
            })
          
          if (!error) syncResults.contacts++
        }
      }

      // Sync HubSpot deals
      const dealsResponse = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
        headers: { 'Authorization': `Bearer ${integration.access_token}` }
      })
      
      if (dealsResponse.ok) {
        const dealsData = await dealsResponse.json()
        
        for (const deal of dealsData.results || []) {
          const { error } = await supabase
            .from('crm_deals')
            .upsert({
              user_id: userId,
              integration_id: integration.id,
              external_id: deal.id,
              name: deal.properties.dealname,
              amount: deal.properties.amount ? parseFloat(deal.properties.amount) : null,
              stage: deal.properties.dealstage,
              probability: deal.properties.probability ? parseInt(deal.properties.probability) : null,
              expected_close_date: deal.properties.closedate
            }, {
              onConflict: 'integration_id,external_id'
            })
          
          if (!error) syncResults.deals++
        }
      }
    }

    // Log automation event
    await supabase
      .from('automation_events')
      .insert({
        user_id: userId,
        event_type: 'crm_sync_completed',
        event_data: { provider, results: syncResults }
      })

    return new Response(
      JSON.stringify({ success: true, syncResults }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Sync error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
