import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { requestId, providerId } = body;

    if (!requestId || !providerId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Request ID and Provider ID are required' 
      }, { status: 400 });
    }

    // Just log the rejection, request stays available for other providers
    await db.collection('rejectedRequests').insertOne({
      requestId,
      providerId,
      rejectedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Request rejected'
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
