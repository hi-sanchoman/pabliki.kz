/**
 * DB Push
 *
 * This script creates database tables directly from the schema,
 * bypassing the migration files that seem to have errors.
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
  console.log('🔄 Starting schema push...');

  const client = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    // 1. Drop all existing tables in public schema
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
    console.log('✅ Dropped all existing tables');

    // 2. Create schema tables manually
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

    // 3. Run the fix-triggers script separately
    console.log(
      '✅ Schema created successfully. Next, run npm run db:fix-triggers to set up triggers'
    );
  } catch (error) {
    console.error('❌ Schema push failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
