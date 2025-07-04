import { supabase } from '@/integrations/supabase/client';

interface BusinessInfo {
  company_name: string;
  industry: string;
  phone: string;
  email: string;
  address: string;
}

interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  source: 'quickbooks' | 'builtin' | 'manual' | 'none';
  confidence: number;
}

interface CustomerData {
  totalLeads: number;
  conversionRate: number;
  averageDealSize: number;
  pipelineValue: number;
  source: 'hubspot' | 'salesforce' | 'builtin' | 'manual' | 'none';
  confidence: number;
}

interface ScheduleData {
  utilization: number;
  meetingCount: number;
  productiveHours: number;
  source: 'google_calendar' | 'outlook' | 'builtin' | 'manual' | 'none';
  confidence: number;
}

interface QuizInsights {
  chaosScore: number;
  clarityZone: string;
  industryPercentile: number;
  confidence: number;
}

export interface UnifiedBusinessProfile {
  businessInfo: BusinessInfo;
  financialData: FinancialData;
  customerData: CustomerData;
  scheduleData: ScheduleData;
  quizInsights: QuizInsights;
}

export const synthesizeBusinessData = async (userId: string): Promise<UnifiedBusinessProfile> => {
  try {
    // Get all available data sources
    const [
      businessSettings,
      quizData,
      integrations,
      transactions,
      contacts,
      appointments
    ] = await Promise.all([
      getBusinessSettings(userId),
      getQuizData(userId),
      getIntegrations(userId),
      getTransactions(userId),
      getContacts(userId),
      getAppointments(userId)
    ]);

    // Synthesize financial data
    const financialData = synthesizeFinancialData(integrations, transactions);
    
    // Synthesize customer data
    const customerData = synthesizeCustomerData(integrations, contacts);
    
    // Synthesize schedule data
    const scheduleData = synthesizeScheduleData(integrations, appointments);

    return {
      businessInfo: {
        company_name: businessSettings?.company_name || '',
        industry: quizData?.industry || '',
        phone: businessSettings?.phone || '',
        email: businessSettings?.email || '',
        address: businessSettings?.address || ''
      },
      financialData,
      customerData,
      scheduleData,
      quizInsights: {
        chaosScore: quizData?.chaos_score || 50,
        clarityZone: quizData?.clarity_zone || 'unknown',
        industryPercentile: quizData?.industry_percentile || 50,
        confidence: quizData ? 100 : 0
      }
    };
  } catch (error) {
    console.error('Error synthesizing business data:', error);
    throw error;
  }
};

const getBusinessSettings = async (userId: string) => {
  const { data } = await supabase
    .from('business_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data;
};

const getQuizData = async (userId: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('chaos_score, clarity_zone, industry_percentile, industry')
    .eq('user_id', userId)
    .single();
  return data;
};

const getIntegrations = async (userId: string) => {
  const { data } = await supabase
    .from('integrations')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);
  return data || [];
};

const getTransactions = async (userId: string) => {
  const { data } = await supabase
    .from('business_metrics')
    .select('*')
    .eq('user_id', userId)
    .eq('metric_type', 'transaction');
  return data || [];
};

const getContacts = async (userId: string) => {
  const { data } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('user_id', userId);
  return data || [];
};

const getAppointments = async (userId: string) => {
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId);
  return data || [];
};

const synthesizeFinancialData = (integrations: any[], transactions: any[]): FinancialData => {
  // Check for QuickBooks integration
  const quickbooksIntegration = integrations.find(i => i.provider === 'quickbooks');
  
  if (quickbooksIntegration && quickbooksIntegration.is_active) {
    // In a real implementation, you'd fetch data from QuickBooks API
    return {
      revenue: 0, // Would come from QuickBooks
      expenses: 0,
      profit: 0,
      cashFlow: 0,
      source: 'quickbooks',
      confidence: 95
    };
  }
  
  // Use built-in transaction data
  if (transactions.length > 0) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.recorded_at);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    const revenue = monthlyTransactions
      .filter(t => t.context?.type === 'income')
      .reduce((sum, t) => sum + t.value, 0);
      
    const expenses = monthlyTransactions
      .filter(t => t.context?.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0);
    
    return {
      revenue,
      expenses,
      profit: revenue - expenses,
      cashFlow: revenue - expenses, // Simplified
      source: 'builtin',
      confidence: 85
    };
  }
  
  return {
    revenue: 0,
    expenses: 0,
    profit: 0,
    cashFlow: 0,
    source: 'none',
    confidence: 0
  };
};

const synthesizeCustomerData = (integrations: any[], contacts: any[]): CustomerData => {
  // Check for CRM integrations
  const crmIntegration = integrations.find(i => 
    ['hubspot', 'salesforce'].includes(i.provider)
  );
  
  if (crmIntegration && crmIntegration.is_active) {
    return {
      totalLeads: 0, // Would come from CRM API
      conversionRate: 0,
      averageDealSize: 0,
      pipelineValue: 0,
      source: crmIntegration.provider as 'hubspot' | 'salesforce',
      confidence: 95
    };
  }
  
  // Use built-in CRM data
  if (contacts.length > 0) {
    const totalLeads = contacts.length;
    const wonLeads = contacts.filter(c => c.status === 'won').length;
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
    
    return {
      totalLeads,
      conversionRate,
      averageDealSize: 0, // Would need deal data
      pipelineValue: 0, // Would need deal data
      source: 'builtin',
      confidence: 80
    };
  }
  
  return {
    totalLeads: 0,
    conversionRate: 0,
    averageDealSize: 0,
    pipelineValue: 0,
    source: 'none',
    confidence: 0
  };
};

const synthesizeScheduleData = (integrations: any[], appointments: any[]): ScheduleData => {
  // Check for calendar integrations
  const calendarIntegration = integrations.find(i => 
    ['google_calendar', 'outlook'].includes(i.provider)
  );
  
  if (calendarIntegration && calendarIntegration.is_active) {
    return {
      utilization: 0, // Would come from calendar API
      meetingCount: 0,
      productiveHours: 0,
      source: calendarIntegration.provider as 'google_calendar' | 'outlook',
      confidence: 90
    };
  }
  
  // Use built-in appointment data
  if (appointments.length > 0) {
    const thisWeekAppointments = appointments.filter(a => {
      const appointmentDate = new Date(a.scheduled_at);
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      return appointmentDate >= weekStart;
    });
    
    return {
      utilization: Math.min(100, (thisWeekAppointments.length / 40) * 100), // Assuming 40 hour week
      meetingCount: thisWeekAppointments.length,
      productiveHours: thisWeekAppointments.length * 1, // Assuming 1 hour per meeting
      source: 'builtin',
      confidence: 75
    };
  }
  
  return {
    utilization: 0,
    meetingCount: 0,
    productiveHours: 0,
    source: 'none',
    confidence: 0
  };
};