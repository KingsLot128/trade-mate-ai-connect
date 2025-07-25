-- Drop all the triggers that depend on the problematic function
DROP TRIGGER IF EXISTS trigger_update_profile_completeness_profiles ON profiles;
DROP TRIGGER IF EXISTS trigger_update_profile_completeness_business ON business_settings;
DROP TRIGGER IF EXISTS trigger_update_profile_completeness_quiz ON user_quiz_responses;
DROP TRIGGER IF EXISTS trigger_update_profile_completeness_website ON website_analysis;
DROP TRIGGER IF EXISTS trigger_update_profile_completeness_ai ON ai_preferences;

-- Now drop the functions
DROP FUNCTION IF EXISTS update_profile_completeness();
DROP FUNCTION IF EXISTS calculate_profile_completeness(uuid);

-- Remove the trigger that tries to create the non-existent profile records
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;