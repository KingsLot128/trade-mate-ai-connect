-- Recreate the essential profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    user_id, 
    email, 
    full_name, 
    business_name,
    trial_ends_at,
    subscription_status,
    account_status,
    setup_preference,
    business_level
  )
  VALUES (
    gen_random_uuid(),
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'business_name',
    CASE 
      WHEN NEW.email = 'kingslotenterprises@gmail.com' THEN '2099-12-31 23:59:59+00'::timestamptz
      ELSE (now() + interval '14 days')
    END,
    'trial',
    'active',
    'minimal',
    1
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail signup
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();