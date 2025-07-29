-- Create white_label_configs table
CREATE TABLE public.white_label_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_name TEXT NOT NULL,
  brand_colors JSONB NOT NULL DEFAULT '{"primary": "#000000", "secondary": "#ffffff", "accent": "#cccccc"}'::jsonb,
  logo TEXT,
  custom_domain TEXT,
  features TEXT[] DEFAULT '{}',
  monthly_revenue NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create clarity_points table
CREATE TABLE public.clarity_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  point_type TEXT NOT NULL CHECK (point_type IN ('data_entry', 'profile_completion', 'integration_connected', 'insight_viewed', 'action_completed')),
  points INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create api_keys table for CRM integration
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  key_name TEXT NOT NULL,
  api_key TEXT NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.white_label_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clarity_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for white_label_configs
CREATE POLICY "System can manage white label configs" 
ON public.white_label_configs 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create RLS policies for clarity_points
CREATE POLICY "Users can view their own clarity points" 
ON public.clarity_points 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert clarity points" 
ON public.clarity_points 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own clarity points" 
ON public.clarity_points 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for api_keys
CREATE POLICY "Users can manage their own API keys" 
ON public.api_keys 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all API keys" 
ON public.api_keys 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_white_label_configs_updated_at
  BEFORE UPDATE ON public.white_label_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_clarity_points_user_id ON public.clarity_points(user_id);
CREATE INDEX idx_clarity_points_created_at ON public.clarity_points(created_at);
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_white_label_configs_active ON public.white_label_configs(is_active);