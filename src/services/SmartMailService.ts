import { supabase } from '@/integrations/supabase/client';

export interface EmailAccount {
  id: string;
  user_id: string;
  provider: string;
  email_address: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  is_active: boolean;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailConversation {
  id: string;
  user_id: string;
  thread_id: string;
  subject?: string;
  participants: any; // JSONB from database
  contact_id?: string;
  deal_id?: string;
  conversation_stage: string; // Database returns string, will be one of the enum values
  clarity_score: number;
  sentiment_score?: number;
  last_activity_at?: string;
  created_at: string;
}

export interface EmailMessage {
  id: string;
  conversation_id: string;
  sender_email: string;
  recipient_emails: any; // JSONB from database
  subject?: string;
  body_text?: string;
  is_outbound: boolean;
  sentiment_score?: number;
  urgency_score: number;
  response_time_hours?: number;
  message_date: string;
}

export interface EmailInsight {
  id: string;
  user_id: string;
  conversation_id: string;
  insight_type: string; // Will be one of the types from database
  title: string;
  description: string;
  confidence_score: number;
  suggested_actions: any; // JSONB from database
  is_dismissed: boolean;
  created_at: string;
}

export interface AutomationRule {
  id: string;
  user_id: string;
  rule_name: string;
  trigger_conditions: any; // JSONB from database
  actions: any; // JSONB from database
  is_active: boolean;
}

export class SmartMailService {
  static async getEmailAccounts(userId: string): Promise<EmailAccount[]> {
    const { data, error } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  static async addEmailAccount(account: Omit<EmailAccount, 'id' | 'created_at'>): Promise<EmailAccount> {
    const { data, error } = await supabase
      .from('email_accounts')
      .insert(account)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getConversations(userId: string, limit = 50): Promise<EmailConversation[]> {
    const { data, error } = await supabase
      .from('email_conversations')
      .select(`
        *,
        email_messages (
          id,
          sender_email,
          message_date,
          is_outbound
        )
      `)
      .eq('user_id', userId)
      .order('last_activity_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  static async getConversationMessages(conversationId: string): Promise<EmailMessage[]> {
    const { data, error } = await supabase
      .from('email_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('message_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async analyzeEmailSentiment(text: string): Promise<{ sentiment: number; urgency: number }> {
    // Call our AI edge function for sentiment analysis
    const { data, error } = await supabase.functions.invoke('ai-email-analyzer', {
      body: { text, analysis_type: 'sentiment_urgency' }
    });

    if (error) throw error;
    return data;
  }

  static async generateClarityScore(conversationId: string): Promise<number> {
    // Get all messages in conversation
    const messages = await this.getConversationMessages(conversationId);
    
    let clarityScore = 100;
    
    // Analyze response times
    const responseTimings = messages
      .filter(msg => !msg.is_outbound)
      .map(msg => msg.response_time_hours)
      .filter(time => time !== null);

    if (responseTimings.length > 0) {
      const avgResponseTime = responseTimings.reduce((a, b) => (a || 0) + (b || 0), 0) / responseTimings.length;
      
      // Decrease clarity for slow responses
      if (avgResponseTime > 48) clarityScore -= 30;
      else if (avgResponseTime > 24) clarityScore -= 15;
    }

    // Analyze sentiment trends
    const sentiments = messages
      .map(msg => msg.sentiment_score)
      .filter(score => score !== null);

    if (sentiments.length > 0) {
      const avgSentiment = sentiments.reduce((a, b) => (a || 0) + (b || 0), 0) / sentiments.length;
      
      // Decrease clarity for negative sentiment
      if (avgSentiment < -0.3) clarityScore -= 25;
      else if (avgSentiment < 0) clarityScore -= 10;
    }

    // Check for gaps in communication
    const sortedMessages = messages.sort((a, b) => 
      new Date(a.message_date).getTime() - new Date(b.message_date).getTime()
    );

    for (let i = 1; i < sortedMessages.length; i++) {
      const timeDiff = new Date(sortedMessages[i].message_date).getTime() - 
                      new Date(sortedMessages[i-1].message_date).getTime();
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 7) clarityScore -= 20;
      else if (daysDiff > 3) clarityScore -= 10;
    }

    return Math.max(0, Math.min(100, clarityScore));
  }

  static async getInsights(userId: string): Promise<EmailInsight[]> {
    const { data, error } = await supabase
      .from('email_insights')
      .select(`
        *,
        email_conversations (
          subject,
          participants
        )
      `)
      .eq('user_id', userId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async generateInsights(userId: string): Promise<void> {
    const conversations = await this.getConversations(userId);
    
    for (const conversation of conversations) {
      // Check for stalled deals
      if (conversation.last_activity_at) {
        const daysSinceActivity = (Date.now() - new Date(conversation.last_activity_at).getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceActivity > 7 && conversation.conversation_stage === 'active') {
          await this.createInsight({
            user_id: userId,
            conversation_id: conversation.id,
            insight_type: 'stalled_deal',
            title: 'Conversation May Be Stalling',
            description: `No activity for ${Math.floor(daysSinceActivity)} days in conversation: ${conversation.subject}`,
            confidence_score: Math.min(90, daysSinceActivity * 10),
            suggested_actions: [
              { action: 'Send follow-up', description: 'Send a gentle follow-up email' },
              { action: 'Schedule call', description: 'Suggest a quick phone call' }
            ]
          });
        }
      }

      // Check clarity score
      if (conversation.clarity_score < 50) {
        await this.createInsight({
          user_id: userId,
          conversation_id: conversation.id,
          insight_type: 'follow_up_needed',
          title: 'Low Clarity Score Detected',
          description: `Conversation clarity is ${conversation.clarity_score}% - may need attention`,
          confidence_score: 100 - conversation.clarity_score,
          suggested_actions: [
            { action: 'Review conversation', description: 'Check for unclear communications' },
            { action: 'Clarify next steps', description: 'Send a clear next-steps email' }
          ]
        });
      }
    }
  }

  static async createInsight(insight: Omit<EmailInsight, 'id' | 'created_at' | 'is_dismissed'>): Promise<EmailInsight> {
    const { data, error } = await supabase
      .from('email_insights')
      .insert({ ...insight, is_dismissed: false })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async dismissInsight(insightId: string): Promise<void> {
    const { error } = await supabase
      .from('email_insights')
      .update({ is_dismissed: true })
      .eq('id', insightId);

    if (error) throw error;
  }

  static async createAutomationRule(rule: Omit<AutomationRule, 'id'>): Promise<AutomationRule> {
    const { data, error } = await supabase
      .from('email_automation_rules')
      .insert(rule)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAutomationRules(userId: string): Promise<AutomationRule[]> {
    const { data, error } = await supabase
      .from('email_automation_rules')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  static async generateDraft(conversationId: string, type: 'follow_up' | 'clarification' | 'closing'): Promise<string> {
    const messages = await this.getConversationMessages(conversationId);
    
    // Call AI edge function to generate contextual draft
    const { data, error } = await supabase.functions.invoke('ai-email-analyzer', {
      body: { 
        messages: messages.slice(-5), // Last 5 messages for context
        draft_type: type,
        analysis_type: 'generate_draft'
      }
    });

    if (error) throw error;
    return data.draft;
  }

  static async saveDraft(draft: {
    user_id: string;
    conversation_id?: string;
    subject?: string;
    body_text?: string;
    body_html?: string;
    ai_generated?: boolean;
  }): Promise<void> {
    const { error } = await supabase
      .from('email_drafts')
      .insert(draft);

    if (error) throw error;
  }
}