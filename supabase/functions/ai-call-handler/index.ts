
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
    const { phoneNumber, transcript, callType, userId } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Basic AI response logic (will be enhanced with OpenAI later)
    let aiResponse = "Thank you for calling! I'm your AI assistant. How can I help you today?"
    
    if (transcript) {
      const lowerTranscript = transcript.toLowerCase()
      
      if (lowerTranscript.includes('appointment') || lowerTranscript.includes('schedule')) {
        aiResponse = "I'd be happy to help you schedule an appointment. What type of service are you looking for and when would work best for you?"
      } else if (lowerTranscript.includes('quote') || lowerTranscript.includes('price')) {
        aiResponse = "I can help you get a quote for your project. Could you tell me more about what you need?"
      } else if (lowerTranscript.includes('emergency') || lowerTranscript.includes('urgent')) {
        aiResponse = "I understand this is urgent. Let me connect you with someone right away or schedule an emergency appointment."
      } else {
        aiResponse = "Thank you for your call. I'm here to help with scheduling, quotes, or any questions you have about our services."
      }
    }

    // Log the call to database
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
          summary: transcript ? `Customer called regarding: ${transcript.slice(0, 100)}...` : 'Missed call - no transcript available',
          duration: Math.floor(Math.random() * 300) + 30, // Simulated duration
        }
      ])
      .select()

    if (callError) {
      throw callError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        callId: call[0]?.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
