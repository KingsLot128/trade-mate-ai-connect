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
      .insert({
        agency_name: config.agencyName || 'New Agency',
        brand_colors: config.brandColors || { primary: '#000000', secondary: '#ffffff', accent: '#cccccc' },
        logo: config.logo,
        custom_domain: config.customDomain,
        features: config.features || [],
        monthly_revenue: config.monthlyRevenue || 0,
        is_active: config.isActive !== false
      })
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
      .maybeSingle();
    
    if (error || !data) return null;
    
    // Map database response to interface
    return {
      id: data.id,
      agencyName: data.agency_name,
      brandColors: data.brand_colors as any,
      logo: data.logo || '',
      customDomain: data.custom_domain,
      features: data.features || [],
      monthlyRevenue: Number(data.monthly_revenue) || 0,
      isActive: data.is_active
    };
  }

  static async updateBranding(agencyId: string, branding: Partial<WhiteLabelConfig>) {
    const updateData: any = {};
    if (branding.agencyName) updateData.agency_name = branding.agencyName;
    if (branding.brandColors) updateData.brand_colors = branding.brandColors;
    if (branding.logo) updateData.logo = branding.logo;
    if (branding.customDomain) updateData.custom_domain = branding.customDomain;
    if (branding.features) updateData.features = branding.features;
    if (branding.monthlyRevenue !== undefined) updateData.monthly_revenue = branding.monthlyRevenue;
    if (branding.isActive !== undefined) updateData.is_active = branding.isActive;

    const { data, error } = await supabase
      .from('white_label_configs')
      .update(updateData)
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