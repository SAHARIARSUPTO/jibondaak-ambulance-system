import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const BedAvailabilityModel = require('@/models/BedAvailability');

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const beds = await BedAvailabilityModel.findAll(db);

    return NextResponse.json({ 
      success: true, 
      beds
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
