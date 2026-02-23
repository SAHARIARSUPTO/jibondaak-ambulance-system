import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const TripShareModel = require('@/models/TripShare');

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { bookingId, userId, sharedWith } = body;

    if (!bookingId || !userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Booking ID and User ID are required' 
      }, { status: 400 });
    }

    // Create trip share
    const tripShare = await TripShareModel.create(db, {
      bookingId,
      sharedBy: userId,
      sharedWith: sharedWith || []
    });

    // Generate share link
    const shareLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track/${tripShare.shareToken}`;

    return NextResponse.json({ 
      success: true, 
      message: 'Trip share link created',
      shareLink,
      shareToken: tripShare.shareToken
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
