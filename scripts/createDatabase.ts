/**
 * Test script to create and seed the database
 * This creates the database file and seeds it with all mock data
 *
 * Note: This won't work in Node.js environment since expo-sqlite
 * requires React Native runtime. Use this as reference only.
 *
 * To actually create the database, run the app with: npm start
 */

import { initDatabase } from '../src/database/schema';
import { seedDatabase } from '../src/database/dataMigration';

async function createDatabase() {
  try {
    console.log('Creating SQLite database...');
    const db = await initDatabase();
    console.log('✓ Database created successfully');
    console.log('Database location: Will be in app data directory when app runs');

    console.log('\nSeeding database with mock data...');
    await seedDatabase();
    console.log('✓ Database seeded successfully');

    console.log('\n✅ Complete! Database ready with all mock data');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createDatabase();