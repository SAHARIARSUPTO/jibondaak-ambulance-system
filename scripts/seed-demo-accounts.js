/**
 * Seed script for demo accounts
 * Run with: node scripts/seed-demo-accounts.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'jibondaak';

const demoAccounts = [
  {
    email: 'admin@jibondaak.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    phone: '01600000000',
  },
  {
    email: 'provider@demo.com',
    password: 'demo123',
    role: 'PROVIDER',
    name: 'Demo Ambulance Provider',
    phone: '01700000000',
    companyName: 'Demo Ambulance Service',
    ambulanceNumber: 'DEMO-001',
    isOnline: true,
    division_id: '30',
    district_id: '26',
    upazila_id: '1',
  },
  {
    email: 'user@demo.com',
    password: 'demo123',
    role: 'seeker',
    name: 'Demo Patient',
    phone: '01800000000',
    division_id: '30',
    district_id: '26',
    upazila_id: '1',
  },
  {
    email: 'hospital@demo.com',
    password: 'demo123',
    role: 'HOSPITAL',
    name: 'Demo Hospital',
    phone: '01900000000',
    address: 'Demo Hospital Address',
    beds: 100,
    icu: 20,
    emergency_services: '24/7 Emergency',
    division_id: '30',
    district_id: '26',
    upazila_id: '1',
  },
];

async function seedDemoAccounts() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    for (const account of demoAccounts) {
      const { email, password, ...userData } = account;

      // Check if user already exists
      const existingUser = await usersCollection.findOne({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') }
      });

      if (existingUser) {
        console.log(`⚠️  User ${email} already exists, updating...`);
        
        // Update existing user with correct role
        await usersCollection.updateOne(
          { email: { $regex: new RegExp(`^${email}$`, 'i') } },
          { 
            $set: {
              ...userData,
              role: account.role,
              updatedAt: new Date(),
            }
          }
        );
        console.log(`✅ Updated ${email} with role: ${account.role}`);
      } else {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await usersCollection.insertOne({
          ...userData,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: account.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created ${email} with role: ${account.role}`);
      }
    }

    console.log('\n🎉 Demo accounts seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    demoAccounts.forEach(acc => {
      console.log(`  ${acc.role}: ${acc.email} | ${acc.password}`);
    });

  } catch (error) {
    console.error('❌ Error seeding demo accounts:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDemoAccounts();
