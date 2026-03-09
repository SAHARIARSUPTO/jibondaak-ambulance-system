import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const TripShareModel = require('@/models/TripShare');
const BookingModel = require('@/models/Booking');

export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const { token } = params;

    // Find trip share by token
    const tripShare = await TripShareModel.findByToken(db, token);

    if (!tripShare) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired share link' 
      }, { status: 404 });
    }

    // Get booking details
    const booking = await BookingModel.findById(db, tripShare.bookingId);

    if (!booking) {
      return NextResponse.json({ 
        success: false, 
        error: 'Booking not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      booking: {
        status: booking.status,
        userLocation: booking.userLocation,
        driverLocation: booking.driverLocation,
        driverInfo: booking.driverInfo,
        createdAt: booking.createdAt
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
