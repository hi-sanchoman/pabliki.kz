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

interface DbTable {
  table_name: string;
}

interface DbTrigger {
  trigger_name: string;
  event_manipulation: string;
  action_statement: string;
}

interface DbPolicy {
  tablename: string;
  policyname: string;
  cmd: string;
  qual: string | null;
}

async function main() {
  console.log('🔄 Verifying database migration...');

  const client = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  try {
    // Check tables exist
    console.log('Checking tables...');

    // Get a list of all tables
    const tablesResult = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    // Cast the result to the correct type
    const tables = tablesResult as unknown as DbTable[];
    console.log('Tables found:', tables.map((t) => t.table_name).join(', '));

    // Check if trigger exists
    console.log('\nChecking profile trigger...');
    const triggersResult = await db.execute(`
      SELECT trigger_name, event_manipulation, action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'users'
    `);

    // Cast the result to the correct type
    const triggers = triggersResult as unknown as DbTrigger[];

    if (triggers.length > 0) {
      console.log('✅ Profile trigger found:');
      triggers.forEach((trigger) => {
        console.log(
          `- ${trigger.trigger_name}: ${trigger.event_manipulation} / ${trigger.action_statement.substring(0, 50)}...`
        );
      });
    } else {
      console.log('❌ No triggers found for users table');
    }

    // Check RLS policies
    console.log('\nChecking RLS policies...');
    const policiesResult = await db.execute(`
      SELECT tablename, policyname, cmd, qual
      FROM pg_policies
      WHERE tablename = 'profiles'
    `);

    // Cast the result to the correct type
    const policies = policiesResult as unknown as DbPolicy[];

    if (policies.length > 0) {
      console.log('✅ RLS policies found for profiles table:');
      policies.forEach((policy) => {
        console.log(
          `- ${policy.policyname}: ${policy.cmd} / ${policy.qual ? policy.qual.substring(0, 50) + '...' : 'null'}`
        );
      });
    } else {
      console.log('❌ No RLS policies found for profiles table');
    }

    console.log('\n✅ Migration verification complete');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
