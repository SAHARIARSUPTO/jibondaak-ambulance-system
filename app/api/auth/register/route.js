import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
const UserModel = require('@/models/User');

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { name, email, phone, password, userType, companyName, licenseNumber } = body;

    console.log('📝 Registration attempt:', { email, userType });

    // Validate input
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'All fields are required' 
      }, { status: 400 });
    }

    // Additional validation for providers
    if (userType === 'provider') {
      if (!companyName || !licenseNumber) {
        return NextResponse.json({ 
          success: false, 
          error: 'Company name and license number are required for providers' 
        }, { status: 400 });
      }
    }

    // Hash password before storing
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed');

    // Create user using model
    const user = await UserModel.create(db, {
      name,
      email: email.trim().toLowerCase(), // Normalize email
      phone,
      password: hashedPassword, // Store hashed password
      role: userType || 'user',
      companyName: userType === 'provider' ? companyName : undefined,
      licenseNumber: userType === 'provider' ? licenseNumber : undefined
    });

    console.log('✅ User created successfully:', user.email);

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      user
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}
