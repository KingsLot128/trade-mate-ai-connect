-- Fix unique constraints for upsert operations

-- Add unique constraints where needed for upsert operations
ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
ALTER TABLE business_settings ADD CONSTRAINT business_settings_user_id_unique UNIQUE (user_id);
ALTER TABLE unified_business_profiles ADD CONSTRAINT unified_business_profiles_user_id_unique UNIQUE (user_id);

-- For user_quiz_responses, we need a composite unique constraint
-- since users can have multiple quiz responses but only one per question
ALTER TABLE user_quiz_responses ADD CONSTRAINT user_quiz_responses_user_question_unique UNIQUE (user_id, question_id);