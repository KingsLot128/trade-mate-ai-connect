-- Fix database function security for production
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.assign_admin_roles() SET search_path = public;
ALTER FUNCTION public.has_role(_user_id uuid, _role app_role) SET search_path = public;
ALTER FUNCTION public.handle_special_user_roles() SET search_path = public;
ALTER FUNCTION public.log_admin_activity() SET search_path = public;
ALTER FUNCTION public.handle_new_user_profile() SET search_path = public;
ALTER FUNCTION public.handle_new_user_business_settings() SET search_path = public;
ALTER FUNCTION public.handle_new_user_role() SET search_path = public;
ALTER FUNCTION public.sync_subscription_status() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;