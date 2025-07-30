-- Add instructor_id to profiles table to link students to instructors
ALTER TABLE public.profiles ADD COLUMN instructor_id uuid REFERENCES auth.users(id);

-- Create index for instructor lookups
CREATE INDEX IF NOT EXISTS idx_profiles_instructor_id ON public.profiles(instructor_id);

-- Update RLS policies to allow instructors to view their students
CREATE POLICY "Instructors can view their students' profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'instructor'::app_role) AND instructor_id = auth.uid());

-- Allow instructors to create student profiles
CREATE POLICY "Instructors can create student profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'instructor'::app_role) AND instructor_id = auth.uid());

-- Allow instructors to update their students' profiles
CREATE POLICY "Instructors can update their students' profiles" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'instructor'::app_role) AND instructor_id = auth.uid());

-- Similar policies for other student data tables
CREATE POLICY "Instructors can view their students' customers" 
ON public.customers 
FOR SELECT 
USING (has_role(auth.uid(), 'instructor'::app_role) AND 
       user_id IN (SELECT user_id FROM public.profiles WHERE instructor_id = auth.uid()));

CREATE POLICY "Instructors can view their students' deals" 
ON public.crm_deals 
FOR SELECT 
USING (has_role(auth.uid(), 'instructor'::app_role) AND 
       user_id IN (SELECT user_id FROM public.profiles WHERE instructor_id = auth.uid()));

CREATE POLICY "Instructors can view their students' decisions" 
ON public.ai_decisions 
FOR SELECT 
USING (has_role(auth.uid(), 'instructor'::app_role) AND 
       user_id IN (SELECT user_id FROM public.profiles WHERE instructor_id = auth.uid()));

-- Add has_completed_tour column for the welcome tour system
ALTER TABLE public.profiles ADD COLUMN has_completed_tour boolean DEFAULT false;