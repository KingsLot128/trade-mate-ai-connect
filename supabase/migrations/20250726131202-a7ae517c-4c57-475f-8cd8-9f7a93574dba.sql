-- Create dashboard preferences table
CREATE TABLE IF NOT EXISTS dashboard_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  layout_config JSONB DEFAULT '{}', -- Widget layout and positions
  widget_settings JSONB DEFAULT '{}', -- Individual widget configurations
  active_widgets JSONB DEFAULT '[]', -- List of enabled widgets
  dashboard_role TEXT DEFAULT 'default', -- 'default', 'executive', 'operator', 'analyst'
  custom_metrics JSONB DEFAULT '[]', -- User-defined metrics to track
  quick_actions JSONB DEFAULT '[]', -- Customized quick action buttons
  color_theme TEXT DEFAULT 'default', -- Dashboard color scheme
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE dashboard_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own dashboard preferences" ON dashboard_preferences
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER dashboard_preferences_updated_at
  BEFORE UPDATE ON dashboard_preferences
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create custom widget configurations table
CREATE TABLE IF NOT EXISTS custom_widgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_type TEXT NOT NULL, -- 'metric', 'chart', 'list', 'action'
  widget_name TEXT NOT NULL,
  widget_config JSONB NOT NULL DEFAULT '{}',
  data_source TEXT, -- Where to fetch data from
  refresh_interval INTEGER DEFAULT 300, -- Seconds
  is_active BOOLEAN DEFAULT true,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 1,
  height INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for custom widgets
ALTER TABLE custom_widgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own custom widgets" ON custom_widgets
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER custom_widgets_updated_at
  BEFORE UPDATE ON custom_widgets
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes
CREATE INDEX idx_dashboard_preferences_user_id ON dashboard_preferences(user_id);
CREATE INDEX idx_custom_widgets_user_id ON custom_widgets(user_id);
CREATE INDEX idx_custom_widgets_active ON custom_widgets(user_id, is_active);