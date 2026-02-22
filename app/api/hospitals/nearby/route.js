import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const HospitalModel = require('@/models/Hospital');

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { latitude, longitude, limit } = body;

    if (!latitude || !longitude) {
      return NextResponse.json({ 
        success: false, 
        error: 'Location is required' 
      }, { status: 400 });
    }

    const userLocation = { latitude, longitude };
    const hospitals = await HospitalModel.findNearby(db, userLocation, limit || 10);

    return NextResponse.json({ 
      success: true, 
      hospitals
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
