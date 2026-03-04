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

    console.log('🔍 Fetching requests for provider:', providerId);

    const client = await clientPromise;
    const db = client.db('jibondaak');

    // Find bookings that are searching for drivers
    // Exclude bookings that already have a provider assigned
    const requests = await db.collection('bookings').find({ 
      status: 'searching',
      $or: [
        { assignedProviderId: { $exists: false } },
        { assignedProviderId: null }
      ]
    }).sort({ createdAt: -1 }).limit(10).toArray();

    console.log('✅ Found requests:', requests.length);

    return NextResponse.json({ 
      success: true, 
      requests: requests || []
    });

  } catch (error) {
    console.error('❌ Error in provider/requests:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch requests'
    }, { status: 500 });
  }
}
