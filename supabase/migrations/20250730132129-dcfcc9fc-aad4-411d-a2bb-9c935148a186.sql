-- First migration: Add instructor role only
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'instructor';