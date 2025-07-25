-- Create trigger for automatic profile creation on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_initial_business_profile();

-- Create trigger for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for subscription status sync
CREATE TRIGGER sync_subscription_on_update
  AFTER INSERT OR UPDATE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.sync_subscription_status();

-- Create trigger for admin activity logging
CREATE TRIGGER log_profile_admin_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_activity();