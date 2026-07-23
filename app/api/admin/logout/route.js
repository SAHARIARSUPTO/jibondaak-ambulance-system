import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

/**
 * POST /api/admin/logout
 * Destroy admin session
 */
export async function POST(request) {
  try {
    // Destroy the session
    await destroySession();

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
