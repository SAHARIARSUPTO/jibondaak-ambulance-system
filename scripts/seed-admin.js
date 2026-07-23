/**
 * Seed script to create an initial admin user
 * Run with: node scripts/seed-admin.js
 */

import { getDb } from '../lib/dbStore.js';
import { hashPassword } from '../lib/auth.js';

async function seedAdmin() {
  try {
    console.log('Connecting to database...');
    const db = await getDb();

    const adminEmail = 'admin@jibondaak.com';
    const adminPassword = 'Admin123!'; // Change this in production!

    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists with email:', adminEmail);
      console.log('Skipping creation.');
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(adminPassword);

    // Create admin user
    const adminUser = {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      name: 'System Administrator',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(adminUser);

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('User ID:', result.insertedId);

  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedAdmin();
