import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { email, password, role } = body;
    const normalizedEmail = email?.trim().toLowerCase();
    const userType = role;

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

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', normalizedEmail);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials. Please check your email and password.' 
      }, { status: 401 });
    }

    console.log('📋 User details:', { email: user.email, role: user.role });

    // Normalize user role for comparison
    const userRole = (user.role || 'seeker').toLowerCase();
    const requestedRole = (role || userType || '').toLowerCase();

    // Role mapping for flexible matching
    const roleAliases = {
      'provider': ['provider', 'ambulance_provider', 'driver'],
      'seeker': ['seeker', 'user', 'patient'],
      'hospital': ['hospital', 'hospital_admin'],
    };

    // Check if role matches (with aliases)
    if (requestedRole) {
      const allowedRoles = roleAliases[requestedRole] || [requestedRole];
      const isRoleMatch = allowedRoles.includes(userRole);

      if (!isRoleMatch) {
        console.log('❌ Role mismatch:', { requested: requestedRole, actual: userRole, allowed: allowedRoles });
        
        // Provide helpful error message with correct login link
        const loginPaths = {
          'provider': '/login/provider',
          'seeker': '/login/seeker',
          'hospital': '/hospital-login',
        };
        
        const correctPath = loginPaths[userRole] || '/login';
        
        return NextResponse.json({ 
          success: false, 
          error: `This account is registered as ${userRole.toUpperCase()}. Please use the correct login page.`,
          correctLoginPath: correctPath,
          userRole: userRole,
        }, { status: 403 });
      }
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    const normalizedUser = {
      ...userWithoutPassword,
      _id: userWithoutPassword?._id?.toString?.() || String(userWithoutPassword?._id || ""),
      division: userWithoutPassword?.division ? String(userWithoutPassword.division) : "",
      district: userWithoutPassword?.district ? String(userWithoutPassword.district) : "",
      upazila: userWithoutPassword?.upazila ? String(userWithoutPassword.upazila) : "",
    };

    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      user: normalizedUser
    });

  } catch (error) {
    console.error('💥 Login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Something went wrong. Please try again.' 
    }, { status: 500 });
  }
}
