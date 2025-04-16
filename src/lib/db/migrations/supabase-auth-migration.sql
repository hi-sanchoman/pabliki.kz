-- Create profile trigger function
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, user_id, created_at, updated_at)
  VALUES (gen_random_uuid(), NEW.id, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on users table
DROP TRIGGER IF EXISTS create_profile_trigger ON users;
CREATE TRIGGER create_profile_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_user();

-- Grant necessary permissions for NextAuth
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Add RLS policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own profiles
CREATE POLICY profiles_select_policy ON profiles
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to update their own profiles
CREATE POLICY profiles_update_policy ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for the system to insert profiles (via the trigger)
CREATE POLICY profiles_insert_policy ON profiles
  FOR INSERT
  WITH CHECK (true); 