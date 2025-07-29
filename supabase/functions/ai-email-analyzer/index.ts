import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailAnalysisRequest {
  text?: string;
  messages?: Array<{
    sender_email: string;
    body_text?: string;
    is_outbound: boolean;
    message_date: string;
  }>;
  analysis_type: 'sentiment_urgency' | 'generate_draft';
  draft_type?: 'follow_up' | 'clarification' | 'closing';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, messages, analysis_type, draft_type }: EmailAnalysisRequest = await req.json();

    if (analysis_type === 'sentiment_urgency' && text) {
      // Analyze sentiment and urgency of email text
      const analysisPrompt = `
        Analyze the following email text for sentiment and urgency. 
        Return a JSON response with:
        - sentiment: number between -1.0 (very negative) and 1.0 (very positive)
        - urgency: number between 0 (not urgent) and 100 (extremely urgent)
        
        Email text: "${text}"
        
        Consider factors like:
        - Emotional tone (positive, negative, neutral)
        - Urgency indicators (deadlines, "ASAP", "urgent", etc.)
        - Question marks and requests for immediate action
        - Overall communication style
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert email analyzer. Always respond with valid JSON only.' },
            { role: 'user', content: analysisPrompt }
          ],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      const analysis = JSON.parse(data.choices[0].message.content);

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (analysis_type === 'generate_draft' && messages) {
      // Generate email draft based on conversation context
      const conversationContext = messages.map(msg => 
        `${msg.is_outbound ? 'You' : msg.sender_email}: ${msg.body_text || 'No content'}`
      ).join('\n\n');

      let draftPrompt = '';
      switch (draft_type) {
        case 'follow_up':
          draftPrompt = `
            Based on this email conversation, write a professional follow-up email.
            The email should be polite, brief, and gently remind about next steps.
            
            Conversation context:
            ${conversationContext}
            
            Write a follow-up email that:
            - References the previous conversation
            - Politely asks for an update
            - Suggests next steps
            - Maintains a professional tone
          `;
          break;
        case 'clarification':
          draftPrompt = `
            Based on this email conversation, write a clarification email.
            The email should ask for specific details or clarify next steps.
            
            Conversation context:
            ${conversationContext}
            
            Write a clarification email that:
            - Identifies what needs clarification
            - Asks specific questions
            - Suggests a clear path forward
            - Maintains professionalism
          `;
          break;
        case 'closing':
          draftPrompt = `
            Based on this email conversation, write a closing email.
            The email should move toward finalizing the discussion or deal.
            
            Conversation context:
            ${conversationContext}
            
            Write a closing email that:
            - Summarizes key points
            - Proposes next steps to close
            - Creates urgency without being pushy
            - Maintains enthusiasm
          `;
          break;
        default:
          draftPrompt = 'Write a professional email response based on the conversation context.';
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a professional email writer. Write clear, concise, and effective business emails. Return only the email content without subject line.' 
            },
            { role: 'user', content: draftPrompt }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const draft = data.choices[0].message.content;

      return new Response(JSON.stringify({ draft }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid analysis type or missing data' }), 
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ai-email-analyzer function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});