-- First, let's make sure we have the correct app_role enum values
-- Check existing enum values and add 'super_admin' if needed
DO $$ 
BEGIN
    -- Try to add super_admin to the enum if it doesn't exist
    BEGIN
        ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'super_admin';
    EXCEPTION 
        WHEN duplicate_object THEN 
            -- Value already exists, continue
            NULL;
    END;
END $$;

-- Create a function to assign roles to specific users by email
CREATE OR REPLACE FUNCTION public.assign_admin_roles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    kingslot_user_id uuid;
    ajose_user_id uuid;
BEGIN
    -- Get user IDs from auth.users based on email
    SELECT id INTO kingslot_user_id 
    FROM auth.users 
    WHERE email = 'kingslotenterprises@gmail.com' 
    LIMIT 1;
    
    SELECT id INTO ajose_user_id 
    FROM auth.users 
    WHERE email = 'ajose002@gmail.com' 
    LIMIT 1;
    
    -- Assign admin role to kingslot if user exists
    IF kingslot_user_id IS NOT NULL THEN
        -- Remove existing role first
        DELETE FROM public.user_roles WHERE user_id = kingslot_user_id;
        
        -- Insert admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (kingslot_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin role assigned to kingslotenterprises@gmail.com';
    ELSE
        RAISE NOTICE 'User kingslotenterprises@gmail.com not found - they need to sign up first';
    END IF;
    
    -- Assign user role to ajose if user exists
    IF ajose_user_id IS NOT NULL THEN
        -- Remove existing role first
        DELETE FROM public.user_roles WHERE user_id = ajose_user_id;
        
        -- Insert user role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (ajose_user_id, 'user')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'User role assigned to ajose002@gmail.com';
    ELSE
        RAISE NOTICE 'User ajose002@gmail.com not found - they need to sign up first';
    END IF;
END;
$$;

-- Run the function to assign roles
SELECT public.assign_admin_roles();

-- Create a trigger to automatically assign admin role to kingslot when they sign up
CREATE OR REPLACE FUNCTION public.handle_special_user_roles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Check if this is the kingslot admin user
    IF NEW.email = 'kingslotenterprises@gmail.com' THEN
        -- Remove the default 'user' role that gets assigned
        DELETE FROM public.user_roles WHERE user_id = NEW.id;
        
        -- Assign admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin role automatically assigned to kingslotenterprises@gmail.com';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_special_user_created ON auth.users;
CREATE TRIGGER on_auth_special_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_special_user_roles();