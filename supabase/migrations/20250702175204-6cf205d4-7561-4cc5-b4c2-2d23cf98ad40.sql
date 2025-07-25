-- Store AI-generated decisions for the Decision Feed
CREATE TABLE public.ai_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  decision_type TEXT NOT NULL, -- 'revenue', 'efficiency', 'communication', 'risk'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact TEXT NOT NULL, -- 'high', 'medium', 'low'
  time_to_implement TEXT,
  estimated_value TEXT,
  reasoning TEXT,
  priority INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'dismissed', 'scheduled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  scheduled_for DATE
);

-- Track user interactions with decisions
CREATE TABLE public.decision_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL,
  user_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'viewed', 'completed', 'dismissed', 'scheduled', 'started'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Store business intelligence insights for Clarity Lens
CREATE TABLE public.business_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL, -- 'revenue_trend', 'efficiency_opportunity', 'risk_alert'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score NUMERIC(3,2), -- 0.00 to 1.00
  data_source JSONB,
  impact_estimation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.ai_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_decisions
CREATE POLICY "Users can manage their own decisions" ON public.ai_decisions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all decisions" ON public.ai_decisions
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for decision_interactions
CREATE POLICY "Users can manage their own interactions" ON public.decision_interactions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all interactions" ON public.decision_interactions
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for business_insights
CREATE POLICY "Users can view their own insights" ON public.business_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" ON public.business_insights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create insights" ON public.business_insights
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all insights" ON public.business_insights
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));