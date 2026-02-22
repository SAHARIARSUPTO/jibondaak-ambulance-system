import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const AmbulanceTypeModel = require('@/models/AmbulanceType');

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const types = await AmbulanceTypeModel.findAll(db);

    return NextResponse.json({ 
      success: true, 
      ambulanceTypes: types
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
