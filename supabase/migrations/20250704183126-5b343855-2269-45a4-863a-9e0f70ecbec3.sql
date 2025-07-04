-- Enhanced user state tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS quiz_completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_step TEXT DEFAULT 'not_started';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS setup_preference TEXT DEFAULT 'minimal';

-- Magic link tokens for seamless conversion
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  quiz_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  user_id UUID REFERENCES auth.users(id) DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on magic_link_tokens
ALTER TABLE magic_link_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for magic_link_tokens
CREATE POLICY "Users can view their own magic tokens"
ON magic_link_tokens
FOR SELECT
USING (auth.uid()::text = user_id::text OR auth.uid() IS NULL);

CREATE POLICY "System can manage magic tokens"
ON magic_link_tokens
FOR ALL
USING (true)
WITH CHECK (true);

-- Enhanced recommendations with TikTok-style algorithm
CREATE TABLE IF NOT EXISTS enhanced_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  recommendation_id TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  recommendation_type TEXT NOT NULL,
  stream_type TEXT DEFAULT 'forYou',
  priority_score INTEGER DEFAULT 50,
  personalized_score INTEGER DEFAULT 50,
  confidence_score INTEGER DEFAULT 50,
  hook TEXT NOT NULL,
  estimated_read_time INTEGER DEFAULT 2,
  expected_impact TEXT DEFAULT 'Medium',
  time_to_implement TEXT DEFAULT '1-2 hours',
  reasoning TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on enhanced_recommendations
ALTER TABLE enhanced_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for enhanced_recommendations
CREATE POLICY "Users can view their own recommendations"
ON enhanced_recommendations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can manage recommendations"
ON enhanced_recommendations
FOR ALL
USING (true)
WITH CHECK (true);

-- Engagement tracking for learning algorithm
CREATE TABLE IF NOT EXISTS recommendation_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  recommendation_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL,
  time_spent INTEGER DEFAULT 0,
  scroll_depth FLOAT DEFAULT 0,
  feedback_rating INTEGER DEFAULT NULL,
  outcome_reported TEXT DEFAULT NULL,
  business_impact JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on recommendation_interactions
ALTER TABLE recommendation_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for recommendation_interactions
CREATE POLICY "Users can manage their own interactions"
ON recommendation_interactions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all interactions"
ON recommendation_interactions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- User setup preferences and onboarding state
CREATE TABLE IF NOT EXISTS user_setup_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  setup_preference TEXT NOT NULL,
  onboarding_completed BOOLEAN DEFAULT false,
  preferences_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_setup_preferences
ALTER TABLE user_setup_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_setup_preferences
CREATE POLICY "Users can manage their own preferences"
ON user_setup_preferences
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all preferences"
ON user_setup_preferences
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_recommendations_user_stream ON enhanced_recommendations(user_id, stream_type, created_at);
CREATE INDEX IF NOT EXISTS idx_interactions_user_recommendation ON recommendation_interactions(user_id, recommendation_id);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_token ON magic_link_tokens(token);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_email ON magic_link_tokens(email);

-- Update timestamp trigger for preferences
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_setup_preferences_updated_at
  BEFORE UPDATE ON user_setup_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enhanced_recommendations_updated_at
  BEFORE UPDATE ON enhanced_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();