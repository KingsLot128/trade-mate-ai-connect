-- Fix the handle_new_user function to handle existing profiles gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = ''
AS $$
BEGIN
  -- Use INSERT ... ON CONFLICT DO NOTHING to prevent 409 errors
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
    new.id, 
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'business_name',
    CASE 
      WHEN new.email = 'kingslotenterprises@gmail.com' THEN '2099-12-31 23:59:59+00'::timestamptz
      ELSE (now() + interval '14 days')
    END,
    'trial',
    'active',
    'minimal',
    1
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$;