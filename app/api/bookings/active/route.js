import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const BookingModel = require('@/models/Booking');

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }

    // Find active booking
    const booking = await BookingModel.findActiveByUserId(db, userId);

    if (!booking) {
      return NextResponse.json({ 
        success: true, 
        booking: null
      });
    }

    return NextResponse.json({ 
      success: true, 
      booking
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
