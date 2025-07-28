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
    const { phoneNumber, transcript, callType, userId, isVoiceEnabled } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get user's business context and voice settings
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    const { data: businessSettings } = await supabaseClient
      .from('business_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    const { data: aiPrefs } = await supabaseClient
      .from('ai_preferences')
      .select('preferences_data')
      .eq('user_id', userId)
      .single()

    // Extract voice settings and business context
    const voiceSettings = aiPrefs?.preferences_data?.voice_settings || {}
    const businessContext = {
      companyName: businessSettings?.company_name || profile?.business_name || 'the business',
      industry: profile?.industry || 'service industry',
      services: profile?.primary_service_types || [],
      location: profile?.location,
      priceRange: {
        min: profile?.typical_project_range_min,
        max: profile?.typical_project_range_max
      }
    }

    // Generate contextual AI response
    let aiResponse = generateContextualResponse(transcript, businessContext, voiceSettings)
    let twimlResponse = null

    // If voice is enabled, generate TwiML for voice response
    if (isVoiceEnabled && voiceSettings.enabled) {
      twimlResponse = await generateVoiceResponse(aiResponse, voiceSettings)
    }

    // Determine call priority and follow-up actions
    const priority = determineCallPriority(transcript)
    const followUpActions = generateFollowUpActions(transcript, businessContext)

    // Log the enhanced call data
    const { data: call, error: callError } = await supabaseClient
      .from('calls')
      .insert([
        {
          user_id: userId,
          phone_number: phoneNumber,
          call_type: callType || 'inbound',
          status: transcript ? 'answered' : 'missed',
          transcript: transcript,
          ai_response: aiResponse,
          summary: generateCallSummary(transcript, businessContext),
          duration: Math.floor(Math.random() * 300) + 30,
          priority: priority,
          context_used: businessContext,
          voice_enabled: isVoiceEnabled && voiceSettings.enabled,
          follow_up_actions: followUpActions
        }
      ])
      .select()

    if (callError) {
      console.error('Error logging call:', callError)
    }

    // Create revenue opportunity if applicable
    if (priority === 'high' || transcript?.toLowerCase().includes('quote') || transcript?.toLowerCase().includes('schedule')) {
      await supabaseClient
        .from('revenue_opportunities')
        .insert([
          {
            user_id: userId,
            title: `Call Opportunity - ${phoneNumber}`,
            description: `Potential opportunity from call: ${transcript?.slice(0, 100)}...`,
            opportunity_type: 'call_lead',
            status: 'pending',
            priority: priority,
            estimated_value: estimateCallValue(transcript, businessContext.priceRange),
            ai_analysis: {
              urgency: getUrgencyLevel(transcript),
              service_type: detectServiceType(transcript, businessContext.services),
              intent: detectCustomerIntent(transcript)
            }
          }
        ])
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        twimlResponse: twimlResponse,
        callId: call?.[0]?.id,
        priority: priority,
        followUpActions: followUpActions
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in AI voice call handler:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function generateContextualResponse(transcript: string, businessContext: any, voiceSettings: any): string {
  if (!transcript) return `Thank you for calling ${businessContext.companyName}. How can I help you today?`

  const lowerTranscript = transcript.toLowerCase()
  let response = ''

  // Emergency detection
  if (lowerTranscript.includes('emergency') || lowerTranscript.includes('urgent') || 
      lowerTranscript.includes('flooding') || lowerTranscript.includes('leak')) {
    response = `I understand this is urgent. I'm connecting you with ${businessContext.companyName} right away for emergency service`
    if (businessContext.location) {
      response += ` in the ${businessContext.location} area`
    }
    response += '. Can you please provide your exact location and describe the emergency?'
  }
  // Appointment scheduling
  else if (lowerTranscript.includes('appointment') || lowerTranscript.includes('schedule')) {
    response = `I'd be happy to help you schedule an appointment with ${businessContext.companyName}`
    if (businessContext.services.length > 0) {
      response += `. We specialize in ${businessContext.services.slice(0, 2).join(' and ')}`
    }
    response += '. What type of service do you need and when would work best for you?'
  }
  // Quote requests
  else if (lowerTranscript.includes('quote') || lowerTranscript.includes('price') || lowerTranscript.includes('cost')) {
    response = `I can help you get a quote from ${businessContext.companyName}`
    if (businessContext.priceRange?.min && businessContext.priceRange?.max) {
      response += `. Our typical projects range from $${businessContext.priceRange.min.toLocaleString()} to $${businessContext.priceRange.max.toLocaleString()}`
    }
    response += '. Could you tell me more details about what you need?'
  }
  // General inquiry
  else {
    response = `Thank you for calling ${businessContext.companyName}`
    if (businessContext.industry) {
      response += `, your trusted ${businessContext.industry} provider`
    }
    response += '. I\'m here to help with scheduling, quotes, or any questions about our services. How can I assist you today?'
  }

  // Apply response style
  if (voiceSettings.responseStyle === 'concise') {
    response = response.split('.')[0] + '.'
  } else if (voiceSettings.responseStyle === 'friendly') {
    response = response.replace(/\. /g, '! ')
  }

  return response
}

async function generateVoiceResponse(textResponse: string, voiceSettings: any): Promise<string> {
  // Generate TwiML for Twilio voice response
  const voice = voiceSettings.voice || 'alice'
  const language = 'en-US'
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="${voice}" language="${language}">${textResponse}</Say>
    <Gather input="speech" timeout="10" speechTimeout="auto">
        <Say voice="${voice}" language="${language}">Please tell me how I can help you.</Say>
    </Gather>
</Response>`
}

function determineCallPriority(transcript: string): string {
  if (!transcript) return 'low'
  
  const lowerTranscript = transcript.toLowerCase()
  
  if (lowerTranscript.includes('emergency') || lowerTranscript.includes('urgent') || 
      lowerTranscript.includes('flooding') || lowerTranscript.includes('leak') ||
      lowerTranscript.includes('broken')) {
    return 'high'
  }
  
  if (lowerTranscript.includes('quote') || lowerTranscript.includes('schedule') ||
      lowerTranscript.includes('appointment') || lowerTranscript.includes('estimate')) {
    return 'medium'
  }
  
  return 'low'
}

function generateFollowUpActions(transcript: string, businessContext: any): string[] {
  const actions = []
  
  if (!transcript) {
    actions.push('Call back to follow up on missed call')
    return actions
  }
  
  const lowerTranscript = transcript.toLowerCase()
  
  if (lowerTranscript.includes('emergency') || lowerTranscript.includes('urgent')) {
    actions.push('Schedule emergency service within 2 hours')
    actions.push('Send emergency contact information')
  } else if (lowerTranscript.includes('quote') || lowerTranscript.includes('estimate')) {
    actions.push('Prepare detailed quote based on requirements')
    actions.push('Schedule site visit if needed')
  } else if (lowerTranscript.includes('schedule') || lowerTranscript.includes('appointment')) {
    actions.push('Check availability and confirm appointment')
    actions.push('Send appointment confirmation')
  } else {
    actions.push('Follow up with additional information')
    actions.push('Send service brochure')
  }
  
  return actions
}

function generateCallSummary(transcript: string, businessContext: any): string {
  if (!transcript) return 'Missed call - customer did not leave a message'
  
  const intent = detectCustomerIntent(transcript)
  const serviceType = detectServiceType(transcript, businessContext.services)
  const urgency = getUrgencyLevel(transcript)
  
  return `Customer called regarding ${intent}${serviceType ? ` for ${serviceType}` : ''}. Urgency level: ${urgency}. ${transcript.slice(0, 100)}${transcript.length > 100 ? '...' : ''}`
}

function detectCustomerIntent(transcript: string): string {
  const lowerTranscript = transcript.toLowerCase()
  
  if (lowerTranscript.includes('emergency') || lowerTranscript.includes('urgent')) return 'emergency service'
  if (lowerTranscript.includes('quote') || lowerTranscript.includes('estimate') || lowerTranscript.includes('price')) return 'pricing information'
  if (lowerTranscript.includes('schedule') || lowerTranscript.includes('appointment')) return 'appointment scheduling'
  if (lowerTranscript.includes('question') || lowerTranscript.includes('information')) return 'general inquiry'
  
  return 'general inquiry'
}

function detectServiceType(transcript: string, services: string[]): string | null {
  const lowerTranscript = transcript.toLowerCase()
  
  for (const service of services) {
    if (lowerTranscript.includes(service.toLowerCase())) {
      return service
    }
  }
  
  // Common service keywords
  if (lowerTranscript.includes('plumb')) return 'plumbing'
  if (lowerTranscript.includes('electric')) return 'electrical'
  if (lowerTranscript.includes('hvac') || lowerTranscript.includes('heating') || lowerTranscript.includes('cooling')) return 'HVAC'
  if (lowerTranscript.includes('clean')) return 'cleaning'
  if (lowerTranscript.includes('repair')) return 'repair'
  
  return null
}

function getUrgencyLevel(transcript: string): string {
  const lowerTranscript = transcript.toLowerCase()
  
  if (lowerTranscript.includes('emergency') || lowerTranscript.includes('urgent') || 
      lowerTranscript.includes('asap') || lowerTranscript.includes('immediate')) {
    return 'high'
  }
  
  if (lowerTranscript.includes('soon') || lowerTranscript.includes('today') || 
      lowerTranscript.includes('tomorrow')) {
    return 'medium'
  }
  
  return 'low'
}

function estimateCallValue(transcript: string, priceRange: any): number | null {
  if (!priceRange?.min || !priceRange?.max) return null
  
  const lowerTranscript = transcript.toLowerCase()
  
  // Emergency calls typically higher value
  if (lowerTranscript.includes('emergency') || lowerTranscript.includes('urgent')) {
    return Math.round(priceRange.max * 0.8)
  }
  
  // Regular service calls
  if (lowerTranscript.includes('quote') || lowerTranscript.includes('schedule')) {
    return Math.round((priceRange.min + priceRange.max) / 2)
  }
  
  return Math.round(priceRange.min * 1.2)
}