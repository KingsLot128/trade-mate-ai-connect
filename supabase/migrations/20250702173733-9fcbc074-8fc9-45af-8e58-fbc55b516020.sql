-- Store detailed quiz responses for business intelligence
CREATE TABLE public.user_quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id TEXT NOT NULL,
  response JSONB NOT NULL,
  chaos_contribution INTEGER, -- 1-10 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store calculated business metrics
CREATE TABLE public.business_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL, -- 'chaos_index', 'revenue_health', etc.
  value NUMERIC NOT NULL,
  context JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz responses
CREATE POLICY "Users can manage their own quiz responses" ON public.user_quiz_responses
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all quiz responses" ON public.user_quiz_responses
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for business metrics
CREATE POLICY "Users can manage their own metrics" ON public.business_metrics
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all metrics" ON public.business_metrics
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));