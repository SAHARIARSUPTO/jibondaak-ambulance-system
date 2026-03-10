const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function testLogin() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('jibondaak');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email: 'user@demo.com' });
    
    if (user) {
      console.log('User found:', user.email, 'Role:', user.role);
      const isValid = await bcrypt.compare('demo123', user.password);
      console.log('Password valid:', isValid);
    } else {
      console.log('User not found');
    }

    const provider = await usersCollection.findOne({ email: 'provider@demo.com' });
    
    if (provider) {
      console.log('Provider found:', provider.email, 'Role:', provider.role);
      const isValid = await bcrypt.compare('demo123', provider.password);
      console.log('Password valid:', isValid);
    } else {
      console.log('Provider not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testLogin();
