import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
<<<<<<< HEAD
    const { email, password, role } = body;
=======
    const { email, password, userType } = body;

    // Normalize email
    const normalizedEmail = email?.trim().toLowerCase();

    console.log('🔐 Login attempt:', { email: normalizedEmail, userType });
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54

    // Validate input
    if (!normalizedEmail || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    // Find user by email (case-insensitive)
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ 
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }
    });
    
    console.log('👤 User found:', user ? 'YES' : 'NO');

    if (!user) {
      console.log('❌ User not found in database');
      // Generic error - don't reveal if email exists or not
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials. Please check your email and password.' 
      }, { status: 401 });
    }

    console.log('📋 User details:', { email: user.email, role: user.role });

    // Check user type matches
    if (userType && user.role !== userType) {
      console.log('❌ Role mismatch:', { expected: userType, actual: user.role });
      return NextResponse.json({ 
        success: false, 
        error: `This account is not registered as ${userType === 'user' ? 'User' : 'Provider'}` 
      }, { status: 401 });
    }

<<<<<<< HEAD
    const userRole = user.role || 'seeker';

    if (role && role !== userRole) {
      return NextResponse.json({ 
        success: false, 
        error: 'Account role does not match this login portal' 
      }, { status: 403 });
    }

=======
    // Check password using bcrypt
    console.log('🔑 Checking password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔑 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      // Generic error - don't reveal that email was correct
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials. Please check your email and password.' 
      }, { status: 401 });
    }

    console.log('✅ Login successful');

>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('💥 Login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Something went wrong. Please try again.' 
    }, { status: 500 });
  }
}
