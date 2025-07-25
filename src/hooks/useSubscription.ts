import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SubscriptionPlan {
  id: string;
  plan_id: string;
  name: string;
  description: string;
  price_monthly_cents: number;
  price_yearly_cents: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

export interface UserSubscription {
  subscription_status: string;
  subscription_tier: string | null;
  subscription_ends_at: string | null;
  next_billing_date: string | null;
  trial_ends_at: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user has access to premium features
  const hasPremiumAccess = () => {
    if (!subscription) return false;
    
    // Admin user always has access
    if (user?.email === 'kingslotenterprises@gmail.com') return true;
    
    // Allow access if user has active subscription
    if (subscription.subscription_status === 'active') return true;
    
    // Allow trial access if trial hasn't expired
    if (subscription.subscription_status === 'trial' && subscription.trial_ends_at) {
      const trialEnd = new Date(subscription.trial_ends_at);
      return new Date() < trialEnd;
    }
    
    return false;
  };

  // Check if user has specific feature access
  const hasFeatureAccess = (feature: string) => {
    if (!subscription || !subscription.subscription_tier) {
      // Admin user always has access
      if (user?.email === 'kingslotenterprises@gmail.com') return true;
      return false;
    }
    
    // Map features to tiers
    const featureMap: Record<string, string[]> = {
      'clarity_lens': ['professional', 'enterprise'],
      'advanced_ai': ['professional', 'enterprise'],
      'unlimited_contacts': ['professional', 'enterprise'],
      'custom_integrations': ['professional', 'enterprise'],
      'white_label': ['enterprise'],
      'api_access': ['enterprise'],
    };

    const requiredTiers = featureMap[feature] || [];
    return requiredTiers.includes(subscription.subscription_tier);
  };

  // Get trial days remaining
  const getTrialDaysRemaining = () => {
    if (!subscription?.trial_ends_at) return 0;
    const trialEnd = new Date(subscription.trial_ends_at);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Check subscription status
  const checkSubscription = async () => {
    if (!user) return;

    try {
      // Invoke the check-subscription edge function
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      // Also fetch from profiles table as backup
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_tier, subscription_ends_at, next_billing_date, trial_ends_at')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile subscription:', profileError);
        return;
      }

      setSubscription(profileData);
    } catch (error) {
      console.error('Subscription check failed:', error);
      
      // Fallback to profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_tier, subscription_ends_at, next_billing_date, trial_ends_at')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setSubscription(profileData);
      }
    }
  };

  // Fetch subscription plans
  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly_cents');

    if (error) {
      console.error('Error fetching plans:', error);
      return;
    }

    const transformedPlans = (data || []).map(plan => ({
      ...plan,
      features: Array.isArray(plan.features) ? plan.features as string[] : []
    }));

    setPlans(transformedPlans);
  };

  // Create checkout session
  const createCheckout = async (planId: string, interval: 'monthly' | 'yearly' = 'monthly') => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan_id: planId, interval }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  };

  // Manage subscription via customer portal
  const manageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([checkSubscription(), fetchPlans()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return {
    subscription,
    plans,
    loading,
    hasPremiumAccess,
    hasFeatureAccess,
    getTrialDaysRemaining,
    checkSubscription,
    createCheckout,
    manageSubscription,
    refreshSubscription: checkSubscription,
  };
};