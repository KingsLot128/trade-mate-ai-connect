-- Complete database schema for TradeMateAI Master System

-- Business metrics (for tracking and analytics)
CREATE TABLE IF NOT EXISTS business_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC,
  metric_data JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI recommendations (enhanced with website-specific recommendations)
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  hook TEXT,
  priority TEXT DEFAULT 'medium',
  expected_impact TEXT,
  time_to_implement TEXT,
  reasoning TEXT,
  actions JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending',
  engagement_data JSONB DEFAULT '{}',
  source TEXT DEFAULT 'ai_analysis',
  complexity TEXT DEFAULT 'moderate',
  industries TEXT[] DEFAULT '{}',
  business_sizes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Unified business profiles (enhanced for universal intelligence)
CREATE TABLE IF NOT EXISTS unified_business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  profile_data JSONB DEFAULT '{}',
  website_data JSONB DEFAULT '{}',
  ai_preferences JSONB DEFAULT '{}',
  integration_data JSONB DEFAULT '{}',
  profile_completeness INTEGER DEFAULT 0,
  intelligence_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User engagement tracking (enhanced)
CREATE TABLE IF NOT EXISTS user_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  page_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photo uploads (for profile photos)
CREATE TABLE IF NOT EXISTS user_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT DEFAULT 'profile',
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$
BEGIN
    -- Business metrics policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_metrics' AND policyname = 'Users can view their own business metrics') THEN
        CREATE POLICY "Users can view their own business metrics" ON business_metrics
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_metrics' AND policyname = 'Users can insert their own business metrics') THEN
        CREATE POLICY "Users can insert their own business metrics" ON business_metrics
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- AI recommendations policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_recommendations' AND policyname = 'Users can view their own recommendations') THEN
        CREATE POLICY "Users can view their own recommendations" ON ai_recommendations
          FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Unified business profiles policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'unified_business_profiles' AND policyname = 'Users can manage their own unified profile') THEN
        CREATE POLICY "Users can manage their own unified profile" ON unified_business_profiles
          FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;

    -- User engagement policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_engagement' AND policyname = 'Users can manage their own engagement data') THEN
        CREATE POLICY "Users can manage their own engagement data" ON user_engagement
          FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;

    -- User photos policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_photos' AND policyname = 'Users can manage their own photos') THEN
        CREATE POLICY "Users can manage their own photos" ON user_photos
          FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_metrics_user_id ON business_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_business_metrics_type ON business_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_status ON ai_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_type ON ai_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_unified_profiles_user_id ON unified_business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_user_id ON user_engagement(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_event_type ON user_engagement(event_type);
CREATE INDEX IF NOT EXISTS idx_user_photos_user_id ON user_photos(user_id);