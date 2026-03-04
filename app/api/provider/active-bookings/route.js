import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');

    if (!providerId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Provider ID is required' 
      }, { status: 400 });
    }

    console.log('🔍 Fetching active bookings for provider:', providerId);

    const client = await clientPromise;
    const db = client.db('jibondaak');

    // Find active bookings assigned to this provider
    const bookings = await db.collection('bookings').find({ 
      assignedProviderId: providerId,
      status: { $in: ['driver_assigned', 'en_route', 'arrived'] }
    }).sort({ acceptedAt: -1 }).toArray();

    console.log('✅ Found active bookings:', bookings.length);

    return NextResponse.json({ 
      success: true, 
      bookings: bookings || []
    });

  } catch (error) {
    console.error('❌ Error in provider/active-bookings:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch active bookings'
    }, { status: 500 });
  }
}
