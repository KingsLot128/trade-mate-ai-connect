-- SmartMail Sync tables for email integration and automation

-- Email accounts table for storing connected email accounts
CREATE TABLE public.email_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'gmail', 'outlook', etc.
  email_address TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email conversations table for tracking email threads
CREATE TABLE public.email_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email_account_id UUID NOT NULL,
  thread_id TEXT NOT NULL, -- Provider's thread ID
  subject TEXT,
  participants JSONB DEFAULT '[]'::jsonb, -- Array of email addresses
  contact_id UUID, -- Link to CRM contact if available
  deal_id UUID, -- Link to CRM deal if available
  conversation_stage TEXT DEFAULT 'active', -- 'active', 'stalled', 'closed', 'lost'
  clarity_score INTEGER DEFAULT 0, -- 0-100 clarity score
  sentiment_score NUMERIC(3,2), -- -1.0 to 1.0
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual email messages
CREATE TABLE public.email_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  message_id TEXT NOT NULL, -- Provider's message ID
  sender_email TEXT NOT NULL,
  recipient_emails JSONB DEFAULT '[]'::jsonb,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  is_outbound BOOLEAN DEFAULT false,
  sentiment_score NUMERIC(3,2),
  urgency_score INTEGER DEFAULT 0, -- 0-100
  response_time_hours INTEGER, -- Hours to respond
  has_attachments BOOLEAN DEFAULT false,
  message_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email insights and AI analysis
CREATE TABLE public.email_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conversation_id UUID NOT NULL,
  insight_type TEXT NOT NULL, -- 'stalled_deal', 'follow_up_needed', 'positive_signal', 'urgent_response'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score INTEGER DEFAULT 0, -- 0-100
  suggested_actions JSONB DEFAULT '[]'::jsonb,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email automation rules
CREATE TABLE public.email_automation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  rule_name TEXT NOT NULL,
  trigger_conditions JSONB NOT NULL, -- Conditions that trigger the rule
  actions JSONB NOT NULL, -- Actions to take
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email drafts and templates
CREATE TABLE public.email_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conversation_id UUID,
  template_name TEXT,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  ai_generated BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.email_accounts ADD CONSTRAINT fk_email_accounts_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.email_conversations ADD CONSTRAINT fk_conversations_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.email_conversations ADD CONSTRAINT fk_conversations_account FOREIGN KEY (email_account_id) REFERENCES public.email_accounts(id) ON DELETE CASCADE;
ALTER TABLE public.email_conversations ADD CONSTRAINT fk_conversations_contact FOREIGN KEY (contact_id) REFERENCES public.crm_contacts(id) ON DELETE SET NULL;
ALTER TABLE public.email_conversations ADD CONSTRAINT fk_conversations_deal FOREIGN KEY (deal_id) REFERENCES public.crm_deals(id) ON DELETE SET NULL;
ALTER TABLE public.email_messages ADD CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES public.email_conversations(id) ON DELETE CASCADE;
ALTER TABLE public.email_insights ADD CONSTRAINT fk_insights_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.email_insights ADD CONSTRAINT fk_insights_conversation FOREIGN KEY (conversation_id) REFERENCES public.email_conversations(id) ON DELETE CASCADE;
ALTER TABLE public.email_automation_rules ADD CONSTRAINT fk_automation_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.email_drafts ADD CONSTRAINT fk_drafts_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.email_drafts ADD CONSTRAINT fk_drafts_conversation FOREIGN KEY (conversation_id) REFERENCES public.email_conversations(id) ON DELETE CASCADE;

-- Enable RLS on all tables
ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_drafts ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_accounts
CREATE POLICY "Users can manage their own email accounts" 
ON public.email_accounts 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS policies for email_conversations  
CREATE POLICY "Users can manage their own conversations" 
ON public.email_conversations 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS policies for email_messages
CREATE POLICY "Users can view messages from their conversations" 
ON public.email_messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.email_conversations 
  WHERE id = conversation_id AND user_id = auth.uid()
));

CREATE POLICY "System can insert email messages" 
ON public.email_messages 
FOR INSERT 
WITH CHECK (true);

-- RLS policies for email_insights
CREATE POLICY "Users can manage their own email insights" 
ON public.email_insights 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS policies for email_automation_rules
CREATE POLICY "Users can manage their own automation rules" 
ON public.email_automation_rules 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS policies for email_drafts
CREATE POLICY "Users can manage their own email drafts" 
ON public.email_drafts 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_email_accounts_updated_at
BEFORE UPDATE ON public.email_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_conversations_updated_at
BEFORE UPDATE ON public.email_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_automation_rules_updated_at
BEFORE UPDATE ON public.email_automation_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_email_accounts_user_id ON public.email_accounts(user_id);
CREATE INDEX idx_email_conversations_user_id ON public.email_conversations(user_id);
CREATE INDEX idx_email_conversations_thread_id ON public.email_conversations(thread_id);
CREATE INDEX idx_email_messages_conversation_id ON public.email_messages(conversation_id);
CREATE INDEX idx_email_messages_date ON public.email_messages(message_date);
CREATE INDEX idx_email_insights_user_id ON public.email_insights(user_id);
CREATE INDEX idx_email_insights_conversation_id ON public.email_insights(conversation_id);