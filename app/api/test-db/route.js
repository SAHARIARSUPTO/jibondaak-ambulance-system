import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');
    
    // Test connection
    await db.command({ ping: 1 });
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connected successfully!',
      database: 'jibondaak'
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
