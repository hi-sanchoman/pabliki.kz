-- Fix Auth Sync - Migration to ensure users from auth.users are synced to public.users and profiles
-- This ensures that when users register through Supabase Auth, they are properly created in our application tables

-- First check if the trigger exists, create it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'create_profile_trigger'
  ) THEN
    -- Create or replace the trigger function
    CREATE OR REPLACE FUNCTION public.create_profile_for_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO profiles (id, user_id, created_at, updated_at)
      VALUES (gen_random_uuid(), NEW.id, NOW(), NOW());
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    -- Create the trigger
    CREATE TRIGGER create_profile_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_profile_for_user();
  END IF;
END $$;
--> statement-breakpoint

-- Sync existing users from auth.users to public.users
INSERT INTO public.users (id, email, name, image, created_at, updated_at)
SELECT 
  au.id, 
  au.email, 
  COALESCE(raw_user_meta_data->>'name', email) as name,
  COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture') as image,
  au.created_at,
  au.updated_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
);
--> statement-breakpoint

-- Create profiles for users that don't have them
INSERT INTO public.profiles (id, user_id, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  pu.id,
  NOW(),
  NOW()
FROM public.users pu
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles pp WHERE pp.user_id = pu.id
);
--> statement-breakpoint

-- Add RLS (Row Level Security) policies if they don't exist
DO $$
BEGIN
  -- Check if profiles table has RLS enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'profiles'
    AND rowsecurity = true
  ) THEN
    -- Enable RLS on profiles table
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    
    -- Policy for users to view their own profiles
    CREATE POLICY profiles_select_policy ON public.profiles
      FOR SELECT 
      USING (auth.uid() = user_id);
    
    -- Policy for users to update their own profiles
    CREATE POLICY profiles_update_policy ON public.profiles
      FOR UPDATE
      USING (auth.uid() = user_id);
    
    -- Policy for the system to insert profiles (via the trigger)
    CREATE POLICY profiles_insert_policy ON public.profiles
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$; 