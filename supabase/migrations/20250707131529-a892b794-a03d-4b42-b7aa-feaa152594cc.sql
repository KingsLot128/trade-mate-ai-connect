-- Clean up user_quiz_responses duplicates more thoroughly and add constraints separately

-- Delete all user_quiz_responses for the test user to start fresh
DELETE FROM user_quiz_responses WHERE user_id = '320acfb0-cf01-4856-a7ee-d41c6868e032';

-- Add business_settings constraint
ALTER TABLE business_settings ADD CONSTRAINT business_settings_user_id_unique UNIQUE (user_id);

-- Add unified_business_profiles constraint 
ALTER TABLE unified_business_profiles ADD CONSTRAINT unified_business_profiles_user_id_unique UNIQUE (user_id);

-- Add user_quiz_responses constraint
ALTER TABLE user_quiz_responses ADD CONSTRAINT user_quiz_responses_user_question_unique UNIQUE (user_id, question_id);