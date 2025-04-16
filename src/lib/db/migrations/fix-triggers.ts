/**
 * Fix Auth Triggers
 *
 * This script focuses only on fixing the auth triggers that weren't working properly.
 * It sets up the necessary triggers for user creation and profile generation.
 */

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
  console.log('🔄 Fixing auth triggers...');

  const client = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  try {
    // 1. Create auth trigger function
    console.log('🔄 Creating auth user sync trigger...');
    const createAuthFunc = `
      CREATE OR REPLACE FUNCTION handle_auth_user_created()
      RETURNS TRIGGER AS $FUNC$
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
      $FUNC$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    await db.execute(createAuthFunc);

    // 2. Create auth trigger
    console.log('🔄 Setting up auth.users trigger...');
    const dropAuthTrigger = `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`;
    await db.execute(dropAuthTrigger);

    const createAuthTrigger = `
      CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION handle_auth_user_created();
    `;
    await db.execute(createAuthTrigger);

    // 3. Create profile trigger function
    console.log('🔄 Creating profile creation trigger...');
    const createProfileFunc = `
      CREATE OR REPLACE FUNCTION create_profile_for_user()
      RETURNS TRIGGER AS $FUNC$
      BEGIN
        INSERT INTO public.profiles (id, user_id, created_at, updated_at)
        VALUES (gen_random_uuid(), NEW.id, NOW(), NOW())
        ON CONFLICT (user_id) DO NOTHING;
        RETURN NEW;
      END;
      $FUNC$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    await db.execute(createProfileFunc);

    // 4. Create profile trigger
    console.log('🔄 Setting up users->profiles trigger...');
    const dropProfileTrigger = `DROP TRIGGER IF EXISTS create_profile_trigger ON public.users;`;
    await db.execute(dropProfileTrigger);

    const createProfileTrigger = `
      CREATE TRIGGER create_profile_trigger
      AFTER INSERT ON public.users
      FOR EACH ROW
      EXECUTE FUNCTION create_profile_for_user();
    `;
    await db.execute(createProfileTrigger);

    // 5. Enable RLS
    console.log('🔄 Setting up RLS for profiles...');
    const enableRls = `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`;
    await db.execute(enableRls);

    // 6. Create RLS policies
    console.log('🔄 Creating RLS policies...');
    const dropSelectPolicy = `DROP POLICY IF EXISTS profiles_select_policy ON public.profiles;`;
    await db.execute(dropSelectPolicy);

    const createSelectPolicy = `
      CREATE POLICY profiles_select_policy ON public.profiles
        FOR SELECT 
        USING (auth.uid() = user_id);
    `;
    await db.execute(createSelectPolicy);

    const dropUpdatePolicy = `DROP POLICY IF EXISTS profiles_update_policy ON public.profiles;`;
    await db.execute(dropUpdatePolicy);

    const createUpdatePolicy = `
      CREATE POLICY profiles_update_policy ON public.profiles
        FOR UPDATE
        USING (auth.uid() = user_id);
    `;
    await db.execute(createUpdatePolicy);

    const dropInsertPolicy = `DROP POLICY IF EXISTS profiles_insert_policy ON public.profiles;`;
    await db.execute(dropInsertPolicy);

    const createInsertPolicy = `
      CREATE POLICY profiles_insert_policy ON public.profiles
        FOR INSERT
        WITH CHECK (true);
    `;
    await db.execute(createInsertPolicy);

    // 7. Sync existing users
    console.log('🔄 Syncing existing users...');
    const syncUsers = `
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
    `;
    await db.execute(syncUsers);

    // 8. Create missing profiles
    console.log('🔄 Creating missing profiles...');
    const createProfiles = `
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
    `;
    await db.execute(createProfiles);

    // 9. Verify setup
    const userCount = await db.execute(`SELECT COUNT(*) FROM public.users;`);
    const profileCount = await db.execute(`SELECT COUNT(*) FROM public.profiles;`);
    const authUserCount = await db.execute(`SELECT COUNT(*) FROM auth.users;`);
    console.log(`✅ Authentication users: ${JSON.stringify(authUserCount[0])}`);
    console.log(`✅ Public users: ${JSON.stringify(userCount[0])}`);
    console.log(`✅ User profiles: ${JSON.stringify(profileCount[0])}`);

    console.log('✅ Auth triggers fixed successfully');
  } catch (error) {
    console.error('❌ Failed to fix auth triggers:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
