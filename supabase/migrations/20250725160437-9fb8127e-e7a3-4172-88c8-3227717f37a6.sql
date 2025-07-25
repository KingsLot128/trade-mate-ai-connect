-- Remove the problematic trigger that references the non-existent unified_business_profiles table
DROP TRIGGER IF EXISTS update_profile_completeness ON profiles;

-- Also remove the function that references the non-existent table
DROP FUNCTION IF EXISTS update_profile_completeness();

-- Remove the function that calculates profile completeness since it also references non-existent tables
DROP FUNCTION IF EXISTS calculate_profile_completeness(uuid);

-- Remove the trigger that tries to create the non-existent profile records
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;