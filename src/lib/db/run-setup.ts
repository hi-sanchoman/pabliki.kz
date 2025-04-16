/**
 * Database Setup Script
 *
 * This script runs all database setup operations in the correct order:
 * 1. Create tables with our custom push script
 * 2. Set up auth triggers
 * 3. Fix repository imports
 * 4. Verify the setup
 */

import { execSync } from 'child_process';
import path from 'path';

const ROOT_DIR = path.join(__dirname, '..', '..', '..');

async function main() {
  console.log('🚀 Starting database setup...');

  try {
    // Step 1: Create tables with custom push
    console.log('\n🔄 Step 1: Creating database tables...');
    execSync('npm run db:push-custom', { stdio: 'inherit', cwd: ROOT_DIR });

    // Step 2: Set up auth triggers
    console.log('\n🔄 Step 2: Setting up auth triggers...');
    execSync('npm run db:fix-triggers', { stdio: 'inherit', cwd: ROOT_DIR });

    // Step 3: Verify setup
    console.log('\n🔄 Step 4: Verifying setup...');
    execSync('npm run db:verify', { stdio: 'inherit', cwd: ROOT_DIR });

    console.log('\n✅ Database setup completed successfully!');
  } catch (error) {
    console.error('\n❌ Database setup failed:', error);
    process.exit(1);
  }
}

main();
