-- Disable email confirmation requirement for signups
-- This allows users to sign up without needing SMTP to be configured
-- Users will be able to login immediately after signup

-- Note: This is a configuration change that needs to be made in the Supabase Dashboard
-- Go to Authentication → Settings → User Signups
-- Set "Enable email confirmations" to OFF

-- For now, let's ensure our auth context handles users without email confirmation
-- No database changes needed, this is a Supabase config setting