/**
 * Script to create demo accounts in MongoDB
 * Run: node scripts/create-demo-accounts.js
 */

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function createDemoAccounts() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('jibondaak');
    const usersCollection = db.collection('users');

    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 10);
    console.log('🔐 Password hashed');

    // Check if demo accounts already exist
    const existingUser = await usersCollection.findOne({ email: 'user@demo.com' });
    const existingProvider = await usersCollection.findOne({ email: 'provider@demo.com' });

    // Create demo user account
    if (!existingUser) {
      const userAccount = {
        name: 'Demo User',
        email: 'user@demo.com',
        phone: '01712345678',
        password: hashedPassword,
        role: 'user',
        createdAt: new Date()
      };

      await usersCollection.insertOne(userAccount);
      console.log('👤 Demo User account created:');
      console.log('   Email: user@demo.com');
      console.log('   Password: demo123');
    } else {
      console.log('⚠️  Demo User account already exists');
    }

    // Create demo provider account
    if (!existingProvider) {
      const providerAccount = {
        name: 'Demo Provider',
        email: 'provider@demo.com',
        phone: '01798765432',
        password: hashedPassword,
        role: 'provider',
        companyName: 'Demo Ambulance Services',
        licenseNumber: 'DAS-2024-001',
        isOnline: false,
        createdAt: new Date()
      };

      await usersCollection.insertOne(providerAccount);
      console.log('🚨 Demo Provider account created:');
      console.log('   Email: provider@demo.com');
      console.log('   Password: demo123');
      console.log('   Company: Demo Ambulance Services');
    } else {
      console.log('⚠️  Demo Provider account already exists');
    }

    console.log('\n✅ Demo accounts setup complete!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('User Account:');
    console.log('  Email: user@demo.com');
    console.log('  Password: demo123');
    console.log('  Dashboard: /dashboard');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Provider Account:');
    console.log('  Email: provider@demo.com');
    console.log('  Password: demo123');
    console.log('  Dashboard: /provider-dashboard');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error creating demo accounts:', error);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

createDemoAccounts();
