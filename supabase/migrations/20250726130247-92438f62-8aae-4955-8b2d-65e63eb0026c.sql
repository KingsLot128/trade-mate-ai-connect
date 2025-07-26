-- Create revenue opportunities table
CREATE TABLE IF NOT EXISTS revenue_opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_type TEXT NOT NULL, -- 'quote_followup', 'maintenance_due', 'upsell', 'cross_sell', 'churn_prevention'
  customer_id UUID REFERENCES customers(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'converted', 'dismissed'
  priority TEXT DEFAULT 'medium', -- 'high', 'medium', 'low'
  estimated_value DECIMAL(10,2),
  confidence_score INTEGER DEFAULT 50, -- 0-100
  title TEXT NOT NULL,
  description TEXT,
  ai_analysis JSONB DEFAULT '{}',
  follow_up_date DATE,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  conversion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE revenue_opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own opportunities" ON revenue_opportunities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own opportunities" ON revenue_opportunities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own opportunities" ON revenue_opportunities
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER revenue_opportunities_updated_at
  BEFORE UPDATE ON revenue_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_revenue_opportunities_user_id ON revenue_opportunities(user_id);
CREATE INDEX idx_revenue_opportunities_status ON revenue_opportunities(status);
CREATE INDEX idx_revenue_opportunities_priority ON revenue_opportunities(priority);
CREATE INDEX idx_revenue_opportunities_follow_up_date ON revenue_opportunities(follow_up_date);

-- Create automated follow-up tracking table
CREATE TABLE IF NOT EXISTS follow_up_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES revenue_opportunities(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'email', 'sms', 'call', 'note'
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
  scheduled_for TIMESTAMP WITH TIME ZONE,
  executed_at TIMESTAMP WITH TIME ZONE,
  content TEXT,
  result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for follow_up_actions
ALTER TABLE follow_up_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own follow-up actions" ON follow_up_actions
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_follow_up_actions_user_id ON follow_up_actions(user_id);
CREATE INDEX idx_follow_up_actions_opportunity_id ON follow_up_actions(opportunity_id);
CREATE INDEX idx_follow_up_actions_scheduled_for ON follow_up_actions(scheduled_for);