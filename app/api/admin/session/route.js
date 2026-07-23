import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/session';

/**
 * GET /api/admin/session
 * Get current admin session data
 */
export async function GET() {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
