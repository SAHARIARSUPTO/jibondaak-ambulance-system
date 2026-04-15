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

    console.log('🔍 Fetching status for provider:', providerId);

    const client = await clientPromise;
    const db = client.db('jibondaak');

    const { ObjectId } = require('mongodb');
    const provider = await db.collection('users').findOne({ 
      _id: new ObjectId(providerId) 
    });

    if (!provider) {
      return NextResponse.json({ 
        success: false, 
        error: 'Provider not found' 
      }, { status: 404 });
    }

    console.log('✅ Provider status:', provider.isOnline || false);

    return NextResponse.json({ 
      success: true, 
      isOnline: provider.isOnline || false
    });

  } catch (error) {
    console.error('❌ Error in provider/status:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch status'
    }, { status: 500 });
  }
}
