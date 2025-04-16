-- Migration to create auth triggers for syncing users and creating profiles

-- 1. Create a trigger to sync auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, image, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    NEW.created_at,
    NEW.updated_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    image = EXCLUDED.image,
    updated_at = EXCLUDED.updated_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
--> statement-breakpoint

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();
--> statement-breakpoint

-- 2. Create a trigger to create profiles for public.users
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, created_at, updated_at)
  VALUES (gen_random_uuid(), NEW.id, NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
--> statement-breakpoint

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS create_profile_trigger ON public.users;

-- Create trigger on public.users
CREATE TRIGGER create_profile_trigger
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_user();
--> statement-breakpoint

-- 3. Set up RLS for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS profiles_select_policy ON public.profiles;
DROP POLICY IF EXISTS profiles_update_policy ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_policy ON public.profiles;

-- Create policies
CREATE POLICY profiles_select_policy ON public.profiles
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY profiles_update_policy ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY profiles_insert_policy ON public.profiles
  FOR INSERT
  WITH CHECK (true);
--> statement-breakpoint 