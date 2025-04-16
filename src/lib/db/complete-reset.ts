/**
 * Complete Database Reset
 *
 * This script performs a complete reset of both:
 * 1. Public schema tables (application data)
 * 2. Auth schema tables (Supabase authentication data)
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as schema from './schema';

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
  console.log('🔄 Starting complete database reset (including auth)...');

  const client = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    // 1. Drop all existing public schema tables
    console.log('🔄 Dropping all public schema tables...');
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
    console.log('✅ Dropped all public schema tables');

    // 2. Clear all auth.users records
    console.log('🔄 Clearing auth.users table...');

    // First check if we can access the auth schema
    try {
      const authResult = await db.execute(`SELECT COUNT(*) FROM auth.users;`);
      console.log(`Found ${JSON.stringify(authResult[0])} users in auth.users table`);

      // Now delete all auth users
      await db.execute(`DELETE FROM auth.users;`);
      console.log('✅ Cleared all records from auth.users table');
    } catch (authError) {
      console.error(
        '❌ Cannot clear auth.users. This might be due to permission issues with the database connection.'
      );
      console.error('   Make sure you are using the service role key with proper permissions.');
      console.error('   Error details:', authError);

      console.log('⚠️ Will continue with public schema reset only...');
    }

    // 3. Create schema tables manually
    console.log('🔄 Creating users table...');
    await db.execute(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text,
        "email" varchar(255) NOT NULL,
        "email_verified" timestamp,
        "image" text,
        "password" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "users_email_unique" UNIQUE("email")
      );
    `);

    console.log('🔄 Creating profiles table...');
    await db.execute(`
      CREATE TABLE "profiles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "bio" text,
        "website" text,
        "location" text,
        "phone_number" varchar(20),
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id"),
        CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action
      );
    `);

    console.log('🔄 Creating auth tables...');
    await db.execute(`
      CREATE TABLE "accounts" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" uuid NOT NULL,
        "type" text NOT NULL,
        "provider" text NOT NULL,
        "provider_account_id" text NOT NULL,
        "refresh_token" text,
        "access_token" text,
        "expires_at" timestamp,
        "token_type" text,
        "scope" text,
        "id_token" text,
        "session_state" text,
        CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action
      );

      CREATE TABLE "sessions" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" uuid NOT NULL,
        "session_token" text NOT NULL,
        "expires" timestamp NOT NULL,
        CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token"),
        CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action
      );

      CREATE TABLE "verification_tokens" (
        "identifier" text NOT NULL,
        "token" text NOT NULL,
        "expires" timestamp NOT NULL,
        CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token"),
        CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
      );
    `);

    console.log('🔄 Setting up auth triggers...');
    // 4. Create or update the trigger for auth user sync
    await db.execute(`
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
    `);

    await db.execute(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`);

    await db.execute(`
      CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION handle_auth_user_created();
    `);

    // 5. Create or update the trigger for user profile creation
    await db.execute(`
      CREATE OR REPLACE FUNCTION create_profile_for_user()
      RETURNS TRIGGER AS $FUNC$
      BEGIN
        INSERT INTO public.profiles (id, user_id, created_at, updated_at)
        VALUES (gen_random_uuid(), NEW.id, NOW(), NOW())
        ON CONFLICT (user_id) DO NOTHING;
        RETURN NEW;
      END;
      $FUNC$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    await db.execute(`DROP TRIGGER IF EXISTS create_profile_trigger ON public.users;`);

    await db.execute(`
      CREATE TRIGGER create_profile_trigger
      AFTER INSERT ON public.users
      FOR EACH ROW
      EXECUTE FUNCTION create_profile_for_user();
    `);

    // 6. Set up RLS for profiles
    console.log('🔄 Setting up Row Level Security...');
    await db.execute(`ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`);

    await db.execute(`DROP POLICY IF EXISTS profiles_select_policy ON public.profiles;`);
    await db.execute(`
      CREATE POLICY profiles_select_policy ON public.profiles
        FOR SELECT 
        USING (auth.uid() = user_id);
    `);

    await db.execute(`DROP POLICY IF EXISTS profiles_update_policy ON public.profiles;`);
    await db.execute(`
      CREATE POLICY profiles_update_policy ON public.profiles
        FOR UPDATE
        USING (auth.uid() = user_id);
    `);

    await db.execute(`DROP POLICY IF EXISTS profiles_insert_policy ON public.profiles;`);
    await db.execute(`
      CREATE POLICY profiles_insert_policy ON public.profiles
        FOR INSERT
        WITH CHECK (true);
    `);

    console.log('✅ Complete database reset successful.');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
