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

    console.log('🔍 Fetching ambulances for provider:', providerId);

    const client = await clientPromise;
    const db = client.db('jibondaak');

    const ambulances = await db.collection('ambulances').find({ 
      providerId 
    }).toArray();

    console.log('✅ Found ambulances:', ambulances.length);

    return NextResponse.json({ 
      success: true, 
      ambulances: ambulances || []
    });

  } catch (error) {
    console.error('❌ Error in provider/ambulances GET:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch ambulances'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      providerId, 
      type, 
      vehicleNumber, 
      licenseNumber, 
      driverName, 
      driverPhone,
      latitude,
      longitude,
      locationLabel
    } = body;

    // Validate input
    if (!providerId || !type || !vehicleNumber || !licenseNumber || !driverName || !driverPhone) {
      return NextResponse.json({ 
        success: false, 
        error: 'All fields are required' 
      }, { status: 400 });
    }

    console.log('🔍 Adding ambulance:', vehicleNumber);

    const client = await clientPromise;
    const db = client.db('jibondaak');

    // Check if vehicle number already exists
    const existing = await db.collection('ambulances').findOne({ vehicleNumber });
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: 'Vehicle number already registered' 
      }, { status: 400 });
    }

    const hasCoords = typeof latitude === 'number' && typeof longitude === 'number';
    const ambulance = {
      providerId,
      type,
      vehicleNumber,
      licenseNumber,
      driverName,
      driverPhone,
      isAvailable: true,
      currentLocation: hasCoords
        ? {
            latitude,
            longitude,
            label: locationLabel || null,
            updatedAt: new Date()
          }
        : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('ambulances').insertOne(ambulance);

    console.log('✅ Ambulance added:', result.insertedId);

    return NextResponse.json({ 
      success: true, 
      message: 'Ambulance registered successfully',
      ambulance: {
        ...ambulance,
        _id: result.insertedId
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error in provider/ambulances POST:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to add ambulance'
    }, { status: 500 });
  }
}
