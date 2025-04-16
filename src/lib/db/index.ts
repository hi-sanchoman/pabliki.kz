import { drizzle } from 'drizzle-orm/postgres-js';
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import * as schema from './schema';

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

if (!DATABASE_URL) {
  throw new Error('Missing DATABASE_URL environment variable');
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Create connection string and pool
const queryClient = postgres(DATABASE_URL, { max: 10 });

// Initialize Drizzle ORM with our schema
export const db = drizzle(queryClient, { schema });

// Helper function for transactions
export async function transaction<T>(callback: (tx: typeof db) => Promise<T>): Promise<T> {
  return queryClient.begin(async (sql) => {
    const tx = drizzle(sql, { schema });
    const result = await callback(tx);
    return result;
  }) as Promise<T>;
}

// Re-export schema
export * from './schema';

// Re-export repositories
export * from './repositories';
