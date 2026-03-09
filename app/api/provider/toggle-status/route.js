import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { providerId, isOnline } = body;

    if (!providerId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Provider ID is required' 
      }, { status: 400 });
    }

    const { ObjectId } = require('mongodb');
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(providerId) },
      { 
        $set: { 
          isOnline,
          lastOnlineAt: new Date()
        }
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Status updated to ${isOnline ? 'online' : 'offline'}`,
      isOnline
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
