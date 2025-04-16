import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('Loading environment variables from .env.local');
  const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
} else {
  console.log('No .env.local file found, falling back to dotenv.config()');
  dotenv.config();
}

const DATABASE_URL = process.env.DATABASE_URL || '';

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

async function main() {
  console.log('🔄 Starting database reset and migration...');

  const migrationClient = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    // 1. Drop all tables (except Supabase auth tables)
    console.log('🔄 Dropping existing tables...');
    await db.execute(`
      DO $$ 
      DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
              EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
    `);
    console.log('✅ Dropped all public tables');

    // 2. Run migrations
    console.log('🔄 Applying migrations...');
    await migrate(db, {
      migrationsFolder: 'src/lib/db/migrations',
    });
    console.log('✅ Applied all migrations');

    // 3. Create or update the trigger for user profile creation
    console.log('🔄 Setting up user profile trigger...');
    await db.execute(`
      -- Create or replace the trigger function
      CREATE OR REPLACE FUNCTION public.create_profile_for_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (id, user_id, created_at, updated_at)
        VALUES (gen_random_uuid(), NEW.id, NOW(), NOW());
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    await db.execute(`
      -- Drop the trigger if it exists
      DROP TRIGGER IF EXISTS create_profile_trigger ON public.users;
    `);

    await db.execute(`
      -- Create the trigger
      CREATE TRIGGER create_profile_trigger
      AFTER INSERT ON public.users
      FOR EACH ROW
      EXECUTE FUNCTION public.create_profile_for_user();
    `);
    console.log('✅ User profile trigger created');

    // 4. Sync existing users from auth.users
    console.log('🔄 Syncing users from auth.users to public.users...');
    await db.execute(`
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
    `);
    console.log('✅ Synced users from auth.users');

    // 5. Create profiles for users that don't have them
    console.log('🔄 Creating profiles for users...');
    await db.execute(`
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
    `);
    console.log('✅ Created missing user profiles');

    // 6. Enable RLS for profiles
    console.log('🔄 Setting up Row Level Security...');
    await db.execute(`
      -- Enable RLS on profiles table
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    `);

    await db.execute(`
      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS profiles_select_policy ON public.profiles;
      DROP POLICY IF EXISTS profiles_update_policy ON public.profiles;
      DROP POLICY IF EXISTS profiles_insert_policy ON public.profiles;
    `);

    await db.execute(`
      -- Policy for users to view their own profiles
      CREATE POLICY profiles_select_policy ON public.profiles
        FOR SELECT 
        USING (auth.uid() = user_id);
    `);

    await db.execute(`
      -- Policy for users to update their own profiles
      CREATE POLICY profiles_update_policy ON public.profiles
        FOR UPDATE
        USING (auth.uid() = user_id);
    `);

    await db.execute(`
      -- Policy for the system to insert profiles (via the trigger)
      CREATE POLICY profiles_insert_policy ON public.profiles
        FOR INSERT
        WITH CHECK (true);
    `);
    console.log('✅ Row Level Security configured');

    // 7. Verify setup
    const userCount = await db.execute(`SELECT COUNT(*) FROM public.users;`);
    const profileCount = await db.execute(`SELECT COUNT(*) FROM public.profiles;`);
    console.log(
      `✅ Verification: Users: ${JSON.stringify(userCount[0])}, Profiles: ${JSON.stringify(profileCount[0])}`
    );

    console.log('✅ Database reset and migration completed successfully');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

main();
