import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const BookingModel = require('@/models/Booking');

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { userId, userLocation, ambulanceType } = body;

    // Validate input
    if (!userId || !userLocation) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID and location are required' 
      }, { status: 400 });
    }

    // Check if user already has an active booking
    const activeBooking = await BookingModel.findActiveByUserId(db, userId);
    if (activeBooking) {
      return NextResponse.json({ 
        success: false, 
        error: 'You already have an active booking',
        booking: activeBooking
      }, { status: 400 });
    }

    // Create new booking
    const booking = await BookingModel.create(db, {
      userId,
      userLocation,
      ambulanceType: ambulanceType || 'basic',
      status: 'searching'
    });

    // Don't auto-assign driver - let provider accept the request
    console.log('✅ Booking created:', booking._id, 'Status:', booking.status);

    return NextResponse.json({ 
      success: true, 
      message: 'Booking created successfully',
      booking
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
