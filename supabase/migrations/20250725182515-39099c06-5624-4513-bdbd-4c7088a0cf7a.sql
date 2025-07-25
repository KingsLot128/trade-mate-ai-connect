-- Fix foreign key references - Remove auth.users references and use profiles table instead

-- First, remove problematic foreign key constraints that reference auth.users
ALTER TABLE public.admin_activity_log DROP CONSTRAINT IF EXISTS admin_activity_log_admin_user_id_fkey;
ALTER TABLE public.admin_activity_log DROP CONSTRAINT IF EXISTS admin_activity_log_target_user_id_fkey;
ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_user_id_fkey;  
ALTER TABLE public.automation_events DROP CONSTRAINT IF EXISTS automation_events_user_id_fkey;
ALTER TABLE public.business_settings DROP CONSTRAINT IF EXISTS business_settings_user_id_fkey;
ALTER TABLE public.calls DROP CONSTRAINT IF EXISTS calls_user_id_fkey;
ALTER TABLE public.crm_contacts DROP CONSTRAINT IF EXISTS crm_contacts_user_id_fkey;
ALTER TABLE public.crm_deals DROP CONSTRAINT IF EXISTS crm_deals_user_id_fkey;
ALTER TABLE public.crm_invoices DROP CONSTRAINT IF EXISTS crm_invoices_user_id_fkey;
ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS customers_user_id_fkey;
ALTER TABLE public.integrations DROP CONSTRAINT IF EXISTS integrations_user_id_fkey;
ALTER TABLE public.magic_link_tokens DROP CONSTRAINT IF EXISTS magic_link_tokens_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_suspended_by_fkey;
ALTER TABLE public.subscribers DROP CONSTRAINT IF EXISTS subscribers_user_id_fkey;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.workflow_rules DROP CONSTRAINT IF EXISTS workflow_rules_user_id_fkey;

-- Fix the business_settings unique constraint conflict
ALTER TABLE public.business_settings DROP CONSTRAINT IF EXISTS business_settings_user_id_key;

-- Ensure profiles table has the correct structure
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id uuid UNIQUE;

-- Now add proper foreign key constraints ONLY where absolutely necessary
-- Most tables should NOT have foreign keys to auth.users for frontend compatibility
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_business_settings_user_id ON public.business_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_user_id ON public.calls(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);