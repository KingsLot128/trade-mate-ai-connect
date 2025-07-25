-- Clean up users except the two specified ones
DELETE FROM public.profiles WHERE user_id NOT IN (
  SELECT id FROM auth.users WHERE email IN ('ajose002@gmail.com', 'kingslotenterprises@gmail.com')
);

-- Note: We cannot directly delete from auth.users table as it's managed by Supabase
-- The admin will need to delete other users manually from the Supabase dashboard