import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }

    // Delete all bookings for this user
    const result = await db.collection('bookings').deleteMany({ 
      userId 
    });

    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${result.deletedCount} bookings`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
