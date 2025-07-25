-- Add the remaining unique constraints

ALTER TABLE business_settings ADD CONSTRAINT business_settings_user_id_unique UNIQUE (user_id);
ALTER TABLE unified_business_profiles ADD CONSTRAINT unified_business_profiles_user_id_unique UNIQUE (user_id);
ALTER TABLE user_quiz_responses ADD CONSTRAINT user_quiz_responses_user_question_unique UNIQUE (user_id, question_id);