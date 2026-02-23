import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const BookingModel = require('@/models/Booking');

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Booking ID is required' 
      }, { status: 400 });
    }

    // Check if booking exists
    const booking = await BookingModel.findById(db, bookingId);
    
    if (!booking) {
      return NextResponse.json({ 
        success: false, 
        error: 'Booking not found' 
      }, { status: 404 });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return NextResponse.json({ 
        success: false, 
        error: 'This booking cannot be cancelled' 
      }, { status: 400 });
    }

    // Update booking status to cancelled
    const result = await BookingModel.updateStatus(db, bookingId, 'cancelled');

    if (result.modifiedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to cancel booking' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
