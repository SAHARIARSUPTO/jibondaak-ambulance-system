import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const UserModel = require('@/models/User');

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { name, email, phone, password } = body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'All fields are required' 
      }, { status: 400 });
    }

    // Create user using model
    const user = await UserModel.create(db, {
      name,
      email,
      phone,
      password, // In production, hash this password before storing
      role: 'user'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      user
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}
