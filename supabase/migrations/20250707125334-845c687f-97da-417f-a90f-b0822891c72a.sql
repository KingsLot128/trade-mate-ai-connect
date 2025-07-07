-- Clean up duplicate data before adding unique constraints

-- First, let's see which tables have duplicates
-- Clean up profiles table - keep only the most recent record per user
DELETE FROM profiles 
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id 
  FROM profiles 
  ORDER BY user_id, updated_at DESC NULLS LAST, created_at DESC NULLS LAST
);

-- Clean up business_settings table - keep only the most recent record per user
DELETE FROM business_settings 
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id 
  FROM business_settings 
  ORDER BY user_id, updated_at DESC NULLS LAST, created_at DESC NULLS LAST
);

-- Clean up unified_business_profiles table - keep only the most recent record per user
DELETE FROM unified_business_profiles 
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id 
  FROM unified_business_profiles 
  ORDER BY user_id, last_updated DESC NULLS LAST
);

-- Now add the unique constraints
ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
ALTER TABLE business_settings ADD CONSTRAINT business_settings_user_id_unique UNIQUE (user_id);
ALTER TABLE unified_business_profiles ADD CONSTRAINT unified_business_profiles_user_id_unique UNIQUE (user_id);

-- For user_quiz_responses, add composite unique constraint
ALTER TABLE user_quiz_responses ADD CONSTRAINT user_quiz_responses_user_question_unique UNIQUE (user_id, question_id);