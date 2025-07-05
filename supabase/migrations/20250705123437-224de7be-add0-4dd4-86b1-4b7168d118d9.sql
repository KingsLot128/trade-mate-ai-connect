-- Add missing profile fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_size TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_in_business INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS primary_goal TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_revenue TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_health_score INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_level INTEGER DEFAULT 1;

-- Website analysis data
CREATE TABLE IF NOT EXISTS website_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  website_url TEXT NOT NULL,
  seo_score INTEGER,
  design_score INTEGER,
  conversion_score INTEGER,
  analysis_data JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  last_analyzed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI preferences
CREATE TABLE IF NOT EXISTS ai_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  frequency TEXT DEFAULT 'daily',
  focus_areas TEXT[] DEFAULT '{}',
  complexity TEXT DEFAULT 'moderate',
  benchmarking BOOLEAN DEFAULT true,
  predictive BOOLEAN DEFAULT true,
  competitive BOOLEAN DEFAULT true,
  preferences_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE website_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies (with conditional check)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'website_analysis' 
        AND policyname = 'Users can manage their own website analysis'
    ) THEN
        CREATE POLICY "Users can manage their own website analysis" ON website_analysis
          FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'ai_preferences' 
        AND policyname = 'Users can manage their own AI preferences'
    ) THEN
        CREATE POLICY "Users can manage their own AI preferences" ON ai_preferences
          FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_website_analysis_user_id ON website_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_preferences_user_id ON ai_preferences(user_id);