-- Add only the missing constraints
DO $$ 
BEGIN
  -- Add business_settings constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'business_settings_user_id_unique' 
    AND table_name = 'business_settings'
  ) THEN
    ALTER TABLE business_settings ADD CONSTRAINT business_settings_user_id_unique UNIQUE (user_id);
  END IF;

  -- Add unified_business_profiles constraint if it doesn't exist  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'unified_business_profiles_user_id_unique' 
    AND table_name = 'unified_business_profiles'
  ) THEN
    ALTER TABLE unified_business_profiles ADD CONSTRAINT unified_business_profiles_user_id_unique UNIQUE (user_id);
  END IF;

  -- Add user_quiz_responses constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_quiz_responses_user_question_unique' 
    AND table_name = 'user_quiz_responses'
  ) THEN
    ALTER TABLE user_quiz_responses ADD CONSTRAINT user_quiz_responses_user_question_unique UNIQUE (user_id, question_id);
  END IF;
END $$;