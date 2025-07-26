-- Fix RLS policies for enhanced_recommendations table to ensure proper access
DROP POLICY IF EXISTS "System can manage recommendations" ON public.enhanced_recommendations;
DROP POLICY IF EXISTS "Users can view their own recommendations" ON public.enhanced_recommendations;

-- Create comprehensive RLS policies for enhanced_recommendations
CREATE POLICY "Users can manage their own recommendations"
ON public.enhanced_recommendations FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow system/functions to insert recommendations for users
CREATE POLICY "System can insert recommendations"
ON public.enhanced_recommendations FOR INSERT
WITH CHECK (true);

-- Ensure ai_recommendations table also has proper policies
DROP POLICY IF EXISTS "Users can view their own recommendations" ON public.ai_recommendations;

CREATE POLICY "Users can manage their own ai_recommendations"
ON public.ai_recommendations FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);