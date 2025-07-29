import { supabase } from '@/integrations/supabase/client';

export interface WhiteLabelConfig {
  id: string;
  agencyName: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logo: string;
  customDomain?: string;
  features: string[];
  monthlyRevenue: number;
  isActive: boolean;
}

export class WhiteLabelService {
  static async createAgencyConfig(config: Partial<WhiteLabelConfig>) {
    const { data, error } = await supabase
      .from('white_label_configs')
      .insert(config)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getAgencyConfig(agencyId: string): Promise<WhiteLabelConfig | null> {
    const { data, error } = await supabase
      .from('white_label_configs')
      .select('*')
      .eq('id', agencyId)
      .eq('is_active', true)
      .single();
    
    if (error) return null;
    return data;
  }

  static async updateBranding(agencyId: string, branding: Partial<WhiteLabelConfig>) {
    const { data, error } = await supabase
      .from('white_label_configs')
      .update(branding)
      .eq('id', agencyId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static applyBrandingToComponent(config: WhiteLabelConfig | null) {
    if (!config) return {};
    
    return {
      '--primary': config.brandColors.primary,
      '--secondary': config.brandColors.secondary,
      '--accent': config.brandColors.accent,
    } as React.CSSProperties;
  }
}