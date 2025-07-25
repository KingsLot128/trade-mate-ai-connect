-- Add subscription fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ DEFAULT NULL;

-- Create subscribers table for detailed subscription tracking
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'trial',
  subscription_tier TEXT,
  stripe_subscription_id TEXT,
  subscription_starts_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  billing_interval TEXT DEFAULT 'monthly',
  amount_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on subscribers table
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers table
CREATE POLICY "Users can view their own subscription" ON public.subscribers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription" ON public.subscribers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can manage subscriptions" ON public.subscribers
  FOR ALL USING (true) WITH CHECK (true);

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly_cents INTEGER NOT NULL,
  price_yearly_cents INTEGER,
  stripe_monthly_price_id TEXT,
  stripe_yearly_price_id TEXT,
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (plan_id, name, description, price_monthly_cents, price_yearly_cents, features, is_popular, is_active) VALUES
('starter', 'Starter', 'Perfect for small businesses getting started', 9700, 107400, 
 '["Basic AI Recommendations", "Business Health Dashboard", "Basic Analytics", "Email Support", "Up to 100 contacts"]', false, true),
('professional', 'Professional', 'For growing businesses that need advanced features', 19700, 218400, 
 '["Everything in Starter", "Advanced AI Insights", "ClarityLens Decision Engine", "Priority Support", "Unlimited contacts", "Custom integrations", "Advanced analytics"]', true, true),
('enterprise', 'Enterprise', 'For established businesses with complex needs', 39700, 438800, 
 '["Everything in Professional", "White-label options", "Dedicated support", "Custom AI training", "API access", "Advanced security", "Custom reporting"]', false, true);

-- Enable RLS on subscription plans (public read)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
  FOR SELECT USING (is_active = true);

-- Function to sync subscription status between profiles and subscribers
CREATE OR REPLACE FUNCTION sync_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profiles table when subscribers table changes
  UPDATE public.profiles 
  SET 
    subscription_status = NEW.subscription_status,
    subscription_tier = NEW.subscription_tier,
    stripe_customer_id = NEW.stripe_customer_id,
    subscription_ends_at = NEW.subscription_ends_at,
    next_billing_date = NEW.next_billing_date,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync subscription status
DROP TRIGGER IF EXISTS sync_subscription_status_trigger ON public.subscribers;
CREATE TRIGGER sync_subscription_status_trigger
  AFTER INSERT OR UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION sync_subscription_status();