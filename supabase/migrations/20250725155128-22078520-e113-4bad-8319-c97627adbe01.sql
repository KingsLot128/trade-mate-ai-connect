-- Make admin user never expire on trial
UPDATE profiles 
SET trial_ends_at = '2099-12-31 23:59:59'::timestamptz
WHERE email = 'kingslotenterprises@gmail.com';