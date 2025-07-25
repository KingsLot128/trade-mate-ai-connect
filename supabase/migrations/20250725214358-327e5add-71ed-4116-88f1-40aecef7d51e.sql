-- Fix RLS policies for new user signup flow
-- Drop existing potentially conflicting policies
DROP POLICY IF EXISTS "Users can update own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own unified profile" ON public.unified_business_profiles;
DROP POLICY IF EXISTS "Users can view own business settings" ON public.business_settings;
DROP POLICY IF EXISTS "Users can update own business settings" ON public.business_settings;

-- Create robust policies that handle immediate post-signup access
CREATE POLICY "Users can view their own profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Fix business_settings policies
CREATE POLICY "Users can view their own business settings"
ON public.business_settings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own business settings"
ON public.business_settings
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business settings"
ON public.business_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Fix unified_business_profiles policies
CREATE POLICY "Users can view their own unified profiles"
ON public.unified_business_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own unified profiles"
ON public.unified_business_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own unified profiles"
ON public.unified_business_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);