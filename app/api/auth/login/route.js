import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const UserModel = require('@/models/User');

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { email, password, userType } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    // Find user by email
    const user = await UserModel.findByEmail(db, email);

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email or password' 
      }, { status: 401 });
    }

    // Check user type matches
    if (userType && user.role !== userType) {
      return NextResponse.json({ 
        success: false, 
        error: `This account is not registered as ${userType === 'user' ? 'User' : 'Provider'}` 
      }, { status: 401 });
    }

    // Check password (In production, use bcrypt.compare)
    if (user.password !== password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email or password' 
      }, { status: 401 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      user: userWithoutPassword
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
