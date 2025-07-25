-- Profile completeness calculation functions and triggers

-- Create function to calculate profile completeness
CREATE OR REPLACE FUNCTION calculate_profile_completeness(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    completeness INTEGER := 0;
    profile_record profiles%ROWTYPE;
    business_record business_settings%ROWTYPE;
    quiz_record user_quiz_responses%ROWTYPE;
    website_record website_analysis%ROWTYPE;
    ai_record ai_preferences%ROWTYPE;
BEGIN
    -- Get all user data
    SELECT * INTO profile_record FROM profiles WHERE user_id = user_uuid;
    SELECT * INTO business_record FROM business_settings WHERE user_id = user_uuid;
    SELECT * INTO quiz_record FROM user_quiz_responses WHERE user_id = user_uuid;
    SELECT * INTO website_record FROM website_analysis WHERE user_id = user_uuid ORDER BY last_analyzed DESC LIMIT 1;
    SELECT * INTO ai_record FROM ai_preferences WHERE user_id = user_uuid;

    -- Basic profile (20 points)
    IF profile_record.business_name IS NOT NULL THEN completeness := completeness + 5; END IF;
    IF profile_record.industry IS NOT NULL THEN completeness := completeness + 5; END IF;
    IF profile_record.phone IS NOT NULL THEN completeness := completeness + 5; END IF;
    IF profile_record.location IS NOT NULL THEN completeness := completeness + 5; END IF;

    -- Business settings (20 points)
    IF business_record.company_name IS NOT NULL THEN completeness := completeness + 10; END IF;
    IF business_record.address IS NOT NULL THEN completeness := completeness + 10; END IF;

    -- Quiz completion (20 points)
    IF quiz_record.response IS NOT NULL AND quiz_record.response != '{}' THEN completeness := completeness + 15; END IF;
    IF quiz_record.chaos_contribution IS NOT NULL THEN completeness := completeness + 5; END IF;

    -- Website analysis (20 points)
    IF website_record.website_url IS NOT NULL THEN completeness := completeness + 10; END IF;
    IF website_record.analysis_data IS NOT NULL AND website_record.analysis_data != '{}' THEN completeness := completeness + 10; END IF;

    -- AI preferences (20 points)
    IF ai_record.frequency IS NOT NULL THEN completeness := completeness + 5; END IF;
    IF ai_record.focus_areas IS NOT NULL AND array_length(ai_record.focus_areas, 1) > 0 THEN completeness := completeness + 10; END IF;
    IF ai_record.complexity IS NOT NULL THEN completeness := completeness + 5; END IF;

    RETURN LEAST(completeness, 100);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update profile completeness
CREATE OR REPLACE FUNCTION update_profile_completeness()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO unified_business_profiles (user_id, profile_completeness, last_updated)
    VALUES (NEW.user_id, calculate_profile_completeness(NEW.user_id), NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        profile_completeness = calculate_profile_completeness(NEW.user_id),
        last_updated = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for profile completeness updates
DROP TRIGGER IF EXISTS trigger_update_profile_completeness_profiles ON profiles;
CREATE TRIGGER trigger_update_profile_completeness_profiles
    AFTER INSERT OR UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_profile_completeness();

DROP TRIGGER IF EXISTS trigger_update_profile_completeness_business ON business_settings;
CREATE TRIGGER trigger_update_profile_completeness_business
    AFTER INSERT OR UPDATE ON business_settings
    FOR EACH ROW EXECUTE FUNCTION update_profile_completeness();

DROP TRIGGER IF EXISTS trigger_update_profile_completeness_quiz ON user_quiz_responses;
CREATE TRIGGER trigger_update_profile_completeness_quiz
    AFTER INSERT OR UPDATE ON user_quiz_responses
    FOR EACH ROW EXECUTE FUNCTION update_profile_completeness();

DROP TRIGGER IF EXISTS trigger_update_profile_completeness_website ON website_analysis;
CREATE TRIGGER trigger_update_profile_completeness_website
    AFTER INSERT OR UPDATE ON website_analysis
    FOR EACH ROW EXECUTE FUNCTION update_profile_completeness();

DROP TRIGGER IF EXISTS trigger_update_profile_completeness_ai ON ai_preferences;
CREATE TRIGGER trigger_update_profile_completeness_ai
    AFTER INSERT OR UPDATE ON ai_preferences
    FOR EACH ROW EXECUTE FUNCTION update_profile_completeness();