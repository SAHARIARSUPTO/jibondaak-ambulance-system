import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

/**
 * POST /api/admin/login
 * Authenticate admin user and create session
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Hardcoded admin credentials for development
    const ADMIN_EMAIL = 'admin@gmail.com';
    const ADMIN_PASSWORD = '123456';

    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    await createSession({
      id: 'admin_001',
      email: email,
      role: 'ADMIN',
    });

    // Return success with user data
    return NextResponse.json({
      success: true,
      user: {
        id: 'admin_001',
        email: email,
        role: 'ADMIN',
        name: 'System Administrator',
      },
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
