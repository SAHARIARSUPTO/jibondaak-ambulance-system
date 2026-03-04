import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'Booking ID and status are required' 
      }, { status: 400 });
    }

    const { ObjectId } = require('mongodb');

    // Update booking status
    await db.collection('bookings').updateOne(
      { _id: new ObjectId(bookingId) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Booking status updated to ${status}`
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
