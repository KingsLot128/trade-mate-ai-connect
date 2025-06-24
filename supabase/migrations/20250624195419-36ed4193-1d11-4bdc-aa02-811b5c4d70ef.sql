
-- Create integrations table for storing OAuth tokens and connection status
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'hubspot', 'salesforce', 'quickbooks', etc.
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CRM contacts table
CREATE TABLE public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  integration_id UUID REFERENCES public.integrations,
  external_id VARCHAR(255), -- ID from external CRM
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  job_title VARCHAR(255),
  address TEXT,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'prospect', 'customer'
  lead_score INTEGER DEFAULT 0,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CRM deals/opportunities table
CREATE TABLE public.crm_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  integration_id UUID REFERENCES public.integrations,
  contact_id UUID REFERENCES public.crm_contacts,
  external_id VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2),
  stage VARCHAR(100), -- 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  actual_close_date DATE,
  description TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table for QuickBooks integration
CREATE TABLE public.crm_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  integration_id UUID REFERENCES public.integrations,
  contact_id UUID REFERENCES public.crm_contacts,
  external_id VARCHAR(255),
  invoice_number VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  due_date DATE,
  paid_date DATE,
  description TEXT,
  line_items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automation events table for Observer OS functionality
CREATE TABLE public.automation_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  event_type VARCHAR(100) NOT NULL, -- 'new_lead', 'missed_call', 'low_stock', 'deal_stage_change'
  event_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow rules table
CREATE TABLE public.workflow_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name VARCHAR(255) NOT NULL,
  trigger_event VARCHAR(100) NOT NULL,
  conditions JSONB DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for integrations
CREATE POLICY "Users can manage their own integrations" 
  ON public.integrations 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for CRM contacts
CREATE POLICY "Users can manage their own CRM contacts" 
  ON public.crm_contacts 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for CRM deals
CREATE POLICY "Users can manage their own CRM deals" 
  ON public.crm_deals 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for CRM invoices
CREATE POLICY "Users can manage their own CRM invoices" 
  ON public.crm_invoices 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for automation events
CREATE POLICY "Users can manage their own automation events" 
  ON public.automation_events 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for workflow rules
CREATE POLICY "Users can manage their own workflow rules" 
  ON public.workflow_rules 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_integrations_user_provider ON public.integrations(user_id, provider);
CREATE INDEX idx_crm_contacts_user_id ON public.crm_contacts(user_id);
CREATE INDEX idx_crm_contacts_external_id ON public.crm_contacts(integration_id, external_id);
CREATE INDEX idx_crm_deals_user_id ON public.crm_deals(user_id);
CREATE INDEX idx_crm_deals_stage ON public.crm_deals(user_id, stage);
CREATE INDEX idx_crm_invoices_user_id ON public.crm_invoices(user_id);
CREATE INDEX idx_crm_invoices_status ON public.crm_invoices(user_id, status);
CREATE INDEX idx_automation_events_processed ON public.automation_events(user_id, processed);
CREATE INDEX idx_workflow_rules_active ON public.workflow_rules(user_id, is_active);
