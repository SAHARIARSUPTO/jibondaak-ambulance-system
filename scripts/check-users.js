const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function checkUsers() {
  try {
    await client.connect();
    const db = client.db('jibondaak');
    const users = await db.collection('users').find({}).toArray();
    
    console.log('Total users:', users.length);
    users.forEach(user => {
      console.log('---');
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Name:', user.name);
      console.log('Has password:', !!user.password);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkUsers();
