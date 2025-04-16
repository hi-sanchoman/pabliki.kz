import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || '';

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

async function main() {
  console.log('🔄 Starting database migration...');

  const migrationClient = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    // First run Drizzle migrations to create the tables
    await migrate(db, {
      migrationsFolder: 'src/lib/db/migrations',
    });

    console.log('✅ Drizzle schema migrations completed successfully');

    // Now apply our custom SQL for the Supabase trigger
    console.log('🔄 Applying custom Supabase trigger migration...');

    const sqlPath = path.join(process.cwd(), 'src/lib/db/migrations/supabase-auth-migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the custom SQL
    await db.execute(sql);

    console.log('✅ Custom Supabase trigger migration completed successfully');
    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

main();
