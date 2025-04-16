import { drizzle } from 'drizzle-orm/postgres-js';
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
  console.log('🔄 Starting auth sync migration...');
  console.log(`Using database URL: ${DATABASE_URL.split('@')[1]}`); // Log only the host part for security

  const migrationClient = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    // First, check if we can access the auth.users schema
    console.log('🔄 Checking if auth schema is accessible...');
    try {
      await db.execute(`SELECT COUNT(*) FROM auth.users;`);
      console.log('✅ Auth schema is accessible');
    } catch (authError) {
      console.error(
        '❌ Cannot access auth schema. Make sure you are using the service role key and have proper permissions.',
        authError
      );
      process.exit(1);
    }

    // Copy users from auth.users to public.users if they don't exist
    console.log('🔄 Copying users from auth.users to public.users...');
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

    // Create profiles for users that don't have them
    console.log("🔄 Creating profiles for users that don't have them...");
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

    // Check if the trigger exists
    console.log('🔄 Checking if the trigger exists...');
    const triggerExists = await db.execute(`
      SELECT 1 
      FROM pg_trigger 
      WHERE tgname = 'create_profile_trigger';
    `);

    // If trigger doesn't exist, create it
    if (!triggerExists || triggerExists.length === 0) {
      console.log('🔄 Trigger does not exist, creating it...');

      // Create the trigger function
      await db.execute(`
        CREATE OR REPLACE FUNCTION public.create_profile_for_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO profiles (id, user_id, created_at, updated_at)
          VALUES (gen_random_uuid(), NEW.id, NOW(), NOW());
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `);

      // Create the trigger
      await db.execute(`
        CREATE TRIGGER create_profile_trigger
        AFTER INSERT ON users
        FOR EACH ROW
        EXECUTE FUNCTION public.create_profile_for_user();
      `);

      console.log('✅ Trigger created successfully');
    } else {
      console.log('✅ Trigger already exists');
    }

    // Verify data was synced by counting users and profiles
    const userCount = await db.execute(`SELECT COUNT(*) FROM public.users;`);
    const profileCount = await db.execute(`SELECT COUNT(*) FROM public.profiles;`);

    console.log(
      `✅ Sync complete. Users: ${JSON.stringify(userCount[0])}, Profiles: ${JSON.stringify(profileCount[0])}`
    );
    console.log('✅ Auth users sync migration completed successfully');
  } catch (error) {
    console.error('❌ Auth sync migration failed:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

main();
