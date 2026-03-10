/**
 * Script to hash plain text passwords in database
 * Run: node scripts/fix-passwords.js
 */

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function fixPasswords() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('jibondaak');
    const usersCollection = db.collection('users');

    // Get all users
    const users = await usersCollection.find({}).toArray();
    console.log(`📋 Found ${users.length} users`);

    let fixed = 0;
    let alreadyHashed = 0;

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
        console.log(`✓ ${user.email} - already hashed`);
        alreadyHashed++;
        continue;
      }

      // Hash the plain text password
      console.log(`🔐 Hashing password for ${user.email}...`);
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Update in database
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );

      console.log(`✅ Fixed password for ${user.email}`);
      fixed++;
    }

    console.log('\n📊 Summary:');
    console.log(`   Total users: ${users.length}`);
    console.log(`   Already hashed: ${alreadyHashed}`);
    console.log(`   Fixed: ${fixed}`);
    console.log('\n✅ Password migration complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

fixPasswords();
