-- Clean up user_quiz_responses duplicates and then add all constraints

-- Clean up user_quiz_responses table - keep only the most recent record per user per question
DELETE FROM user_quiz_responses 
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, question_id) id 
  FROM user_quiz_responses 
  ORDER BY user_id, question_id, created_at DESC NULLS LAST
);

-- Now add all the unique constraints that should work
ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
ALTER TABLE business_settings ADD CONSTRAINT business_settings_user_id_unique UNIQUE (user_id);
ALTER TABLE unified_business_profiles ADD CONSTRAINT unified_business_profiles_user_id_unique UNIQUE (user_id);
ALTER TABLE user_quiz_responses ADD CONSTRAINT user_quiz_responses_user_question_unique UNIQUE (user_id, question_id);