-- Add user account status fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_status text DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated')),
ADD COLUMN IF NOT EXISTS suspended_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS suspended_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS suspension_reason text,
ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone DEFAULT (now() + interval '14 days');

-- Create admin activity log table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES auth.users(id),
  target_user_id uuid REFERENCES auth.users(id),
  action_type text NOT NULL,
  action_details jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin activity log
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin activity log policies
CREATE POLICY "Admins can manage activity logs" ON public.admin_activity_log
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Update profiles policies to allow admins to suspend users
CREATE POLICY "Admins can update user accounts" ON public.profiles
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to log admin activities
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS trigger AS $$
BEGIN
  -- Log profile changes by admins
  IF auth.uid() IS DISTINCT FROM NEW.user_id AND has_role(auth.uid(), 'admin'::app_role) THEN
    INSERT INTO public.admin_activity_log (
      admin_user_id, 
      target_user_id, 
      action_type, 
      action_details
    ) VALUES (
      auth.uid(),
      NEW.user_id,
      'profile_update',
      jsonb_build_object(
        'old_status', OLD.account_status,
        'new_status', NEW.account_status,
        'suspension_reason', NEW.suspension_reason
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for admin activity logging
DROP TRIGGER IF EXISTS log_admin_profile_changes ON public.profiles;
CREATE TRIGGER log_admin_profile_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_activity();