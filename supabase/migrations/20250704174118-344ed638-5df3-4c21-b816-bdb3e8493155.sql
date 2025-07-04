-- Add chaos scoring fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS chaos_score integer DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clarity_zone text DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry_percentile integer DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_overwhelm_score integer DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS revenue_predictability_score integer DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS customer_acquisition_method text DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS biggest_challenge text DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS setup_preference text DEFAULT 'minimal';

-- Create user_quiz_responses table if it doesn't exist (for storing individual responses)
CREATE TABLE IF NOT EXISTS public.user_quiz_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  question_id text NOT NULL,
  response jsonb NOT NULL,
  chaos_contribution integer DEFAULT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on user_quiz_responses
ALTER TABLE public.user_quiz_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for user_quiz_responses (only if table was created)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_quiz_responses' 
        AND policyname = 'Users can manage their own quiz responses'
    ) THEN
        CREATE POLICY "Users can manage their own quiz responses" 
        ON public.user_quiz_responses 
        FOR ALL 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_quiz_responses' 
        AND policyname = 'Admins can view all quiz responses'
    ) THEN
        CREATE POLICY "Admins can view all quiz responses" 
        ON public.user_quiz_responses 
        FOR SELECT 
        USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;