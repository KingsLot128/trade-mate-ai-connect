import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DashboardPreferences {
  layout_config: any;
  widget_settings: any;
  active_widgets: string[];
  dashboard_role: 'default' | 'executive' | 'operator' | 'analyst';
  custom_metrics: any[];
  quick_actions: any[];
  color_theme: string;
}

interface Widget {
  id: string;
  name: string;
  component: string;
  defaultProps?: any;
  category: 'metrics' | 'charts' | 'actions' | 'insights';
  description: string;
  requiredRole?: string[];
}

interface DashboardContextType {
  preferences: DashboardPreferences | null;
  availableWidgets: Widget[];
  loading: boolean;
  updatePreferences: (updates: Partial<DashboardPreferences>) => Promise<void>;
  toggleWidget: (widgetId: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  setDashboardRole: (role: DashboardPreferences['dashboard_role']) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

const defaultWidgets: Widget[] = [
  {
    id: 'profile-completion',
    name: 'Profile Completion Guide',
    component: 'ProfileCompletionGuide',
    category: 'actions',
    description: 'Track and complete your business profile setup'
  },
  {
    id: 'quick-metrics',
    name: 'Quick Metrics Grid',
    component: 'QuickMetricsGrid',
    category: 'metrics',
    description: 'Key business metrics at a glance'
  },
  {
    id: 'business-health',
    name: 'Business Health Dashboard',
    component: 'BusinessHealthDashboard',
    category: 'charts',
    description: 'Comprehensive business health analysis',
    requiredRole: ['default', 'executive', 'analyst']
  },
  {
    id: 'chaos-index',
    name: 'Chaos Index Widget',
    component: 'ChaosIndexWidget',
    category: 'metrics',
    description: 'Monitor and improve business organization'
  },
  {
    id: 'recommendation-bootstrap',
    name: 'AI Recommendations',
    component: 'RecommendationBootstrap',
    category: 'insights',
    description: 'Get AI-powered business recommendations'
  },
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    component: 'QuickActions',
    category: 'actions',
    description: 'Common actions and navigation shortcuts'
  },
  {
    id: 'todays-focus',
    name: "Today's Focus",
    component: 'TodaysFocus',
    category: 'insights',
    description: 'Daily priorities and progress tracking'
  },
  {
    id: 'revenue-metrics',
    name: 'Revenue Metrics',
    component: 'RevenueMetrics',
    category: 'metrics',
    description: 'Revenue tracking and opportunities',
    requiredRole: ['executive', 'analyst']
  }
];

const defaultPreferences: DashboardPreferences = {
  layout_config: {
    grid: 'auto',
    columns: { lg: 3, md: 2, sm: 1 }
  },
  widget_settings: {},
  active_widgets: [
    'profile-completion',
    'quick-metrics', 
    'business-health',
    'chaos-index',
    'recommendation-bootstrap',
    'quick-actions',
    'todays-focus'
  ],
  dashboard_role: 'default',
  custom_metrics: [],
  quick_actions: [
    { name: 'Intelligence Feed', url: '/feed', icon: 'Sparkles' },
    { name: 'Connect Tools', url: '/integrations', icon: 'Settings' },
    { name: 'Health Score', url: '/health', icon: 'TrendingUp' }
  ],
  color_theme: 'default'
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<DashboardPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dashboard_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          layout_config: data.layout_config || defaultPreferences.layout_config,
          widget_settings: data.widget_settings || defaultPreferences.widget_settings,
          active_widgets: Array.isArray(data.active_widgets) ? (data.active_widgets as string[]) : defaultPreferences.active_widgets,
          dashboard_role: (data.dashboard_role as DashboardPreferences['dashboard_role']) || defaultPreferences.dashboard_role,
          custom_metrics: Array.isArray(data.custom_metrics) ? data.custom_metrics : defaultPreferences.custom_metrics,
          quick_actions: Array.isArray(data.quick_actions) ? data.quick_actions : defaultPreferences.quick_actions,
          color_theme: data.color_theme || defaultPreferences.color_theme
        });
      } else {
        // Create default preferences
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error('Error loading dashboard preferences:', error);
      setPreferences(defaultPreferences);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPreferences = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('dashboard_preferences')
        .insert({
          user_id: user.id,
          ...defaultPreferences
        });

      if (error) throw error;
      setPreferences(defaultPreferences);
    } catch (error) {
      console.error('Error creating default preferences:', error);
      setPreferences(defaultPreferences);
    }
  };

  const updatePreferences = async (updates: Partial<DashboardPreferences>) => {
    if (!user || !preferences) return;

    try {
      const newPreferences = { ...preferences, ...updates };
      
      const { error } = await supabase
        .from('dashboard_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences
        });

      if (error) throw error;

      setPreferences(newPreferences);
      toast.success('Dashboard preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update dashboard preferences');
    }
  };

  const toggleWidget = async (widgetId: string) => {
    if (!preferences) return;

    const currentWidgets = preferences.active_widgets;
    const newWidgets = currentWidgets.includes(widgetId)
      ? currentWidgets.filter(id => id !== widgetId)
      : [...currentWidgets, widgetId];

    await updatePreferences({ active_widgets: newWidgets });
  };

  const resetToDefaults = async () => {
    await updatePreferences(defaultPreferences);
    toast.success('Dashboard reset to defaults');
  };

  const setDashboardRole = async (role: DashboardPreferences['dashboard_role']) => {
    // Filter widgets based on role
    const roleBasedWidgets = defaultWidgets
      .filter(widget => !widget.requiredRole || widget.requiredRole.includes(role))
      .map(widget => widget.id);

    await updatePreferences({ 
      dashboard_role: role,
      active_widgets: roleBasedWidgets
    });
  };

  const getAvailableWidgets = () => {
    if (!preferences) return defaultWidgets;
    
    return defaultWidgets.filter(widget => 
      !widget.requiredRole || widget.requiredRole.includes(preferences.dashboard_role)
    );
  };

  const value: DashboardContextType = {
    preferences,
    availableWidgets: getAvailableWidgets(),
    loading,
    updatePreferences,
    toggleWidget,
    resetToDefaults,
    setDashboardRole
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};