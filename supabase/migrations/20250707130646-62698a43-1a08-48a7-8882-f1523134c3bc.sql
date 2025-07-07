-- Manually clean up the specific duplicates and add constraints one by one

-- Clean up the specific duplicate profiles
DELETE FROM profiles 
WHERE user_id = '320acfb0-cf01-4856-a7ee-d41c6868e032' 
AND id NOT IN (
  SELECT id FROM profiles 
  WHERE user_id = '320acfb0-cf01-4856-a7ee-d41c6868e032'
  ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
  LIMIT 1
);

-- Add constraints one by one to see which ones fail
ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);