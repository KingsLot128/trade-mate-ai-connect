-- Part 2: Create the Master Database Function and Trigger
-- This creates a complete business profile for new users across all essential tables

CREATE OR REPLACE FUNCTION public.create_initial_business_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Create profiles record with trial setup
  INSERT INTO public.profiles (
    user_id, 
    email, 
    full_name, 
    trial_ends_at, 
    subscription_status, 
    account_status, 
    setup_preference, 
    business_level,
    onboarding_step
  ) VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.email = 'kingslotenterprises@gmail.com' THEN '2099-12-31 23:59:59+00'::timestamptz
      ELSE (now() + interval '14 days')
    END,
    'trial',
    'active',
    'minimal',
    1,
    'not_started'
  ) ON CONFLICT (user_id) DO NOTHING;

  -- Create business_settings record
  INSERT INTO public.business_settings (
    user_id, 
    company_name, 
    email, 
    phone, 
    address, 
    created_at, 
    updated_at
  ) VALUES (
    NEW.id, 
    '', 
    COALESCE(NEW.email, ''), 
    '', 
    '', 
    NOW(), 
    NOW()
  ) ON CONFLICT (user_id) DO NOTHING;

  -- Create ai_preferences record with defaults
  INSERT INTO public.ai_preferences (
    user_id,
    benchmarking,
    predictive,
    competitive,
    frequency,
    focus_areas,
    complexity,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    true,
    true,
    true,
    'daily',
    ARRAY['revenue', 'efficiency', 'customer_satisfaction'],
    'moderate',
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO NOTHING;

  -- Create unified_business_profiles record
  INSERT INTO public.unified_business_profiles (
    user_id,
    profile_data,
    ai_preferences,
    integration_data,
    website_data,
    profile_completeness,
    intelligence_score,
    created_at,
    last_updated
  ) VALUES (
    NEW.id,
    jsonb_build_object(
      'setup_stage', 'initial',
      'onboarding_completed', false
    ),
    jsonb_build_object(
      'frequency', 'daily',
      'complexity', 'moderate',
      'focus_areas', ARRAY['revenue', 'efficiency', 'customer_satisfaction']
    ),
    '{}',
    '{}',
    15, -- Basic completion for having account
    25, -- Initial intelligence score
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail signup
    RAISE WARNING 'Failed to create complete business profile: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Drop old trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_profile();
DROP FUNCTION IF EXISTS public.handle_new_user_business_settings();
DROP FUNCTION IF EXISTS public.handle_new_user_role();

-- Create the new comprehensive trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_initial_business_profile();

-- Ensure user roles are still handled separately for admin users
CREATE OR REPLACE FUNCTION public.handle_special_user_roles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    -- Check if this is the kingslot admin user
    IF NEW.email = 'kingslotenterprises@gmail.com' THEN
        -- Remove the default 'user' role that gets assigned
        DELETE FROM public.user_roles WHERE user_id = NEW.id;
        
        -- Assign admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin role automatically assigned to kingslotenterprises@gmail.com';
    ELSE
        -- Assign regular user role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'user')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Create trigger for user roles
CREATE TRIGGER on_auth_user_created_roles
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_special_user_roles();