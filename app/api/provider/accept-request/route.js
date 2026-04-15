import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { requestId, providerId } = body;

    console.log('Accept request received:', { requestId, providerId });

    if (!requestId || !providerId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Request ID and Provider ID are required' 
      }, { status: 400 });
    }

    const { ObjectId } = require('mongodb');

    // Validate ObjectId format
    if (!ObjectId.isValid(requestId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request ID format' 
      }, { status: 400 });
    }

    if (!ObjectId.isValid(providerId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid provider ID format' 
      }, { status: 400 });
    }

    // Check if request still available
    const booking = await db.collection('bookings').findOne({ 
      _id: new ObjectId(requestId),
      status: 'searching'
    });

    if (!booking) {
      return NextResponse.json({ 
        success: false, 
        error: 'Request no longer available or already accepted' 
      }, { status: 400 });
    }

    // Get provider details
    const provider = await db.collection('users').findOne({ 
      _id: new ObjectId(providerId) 
    });

    if (!provider) {
      return NextResponse.json({ 
        success: false, 
        error: 'Provider not found' 
      }, { status: 400 });
    }

    // Get an available ambulance from this provider
    console.log('🔍 Looking for ambulance with providerId:', providerId);
    
    // First try to find available ambulance
    let ambulance = await db.collection('ambulances').findOne({ 
      providerId: providerId,
      isAvailable: true
    });
    
    // If no available ambulance, get any ambulance from this provider
    if (!ambulance) {
      console.log('⚠️ No available ambulance, checking all ambulances...');
      ambulance = await db.collection('ambulances').findOne({ 
        providerId: providerId
      });
      
      if (ambulance) {
        console.log('✅ Found ambulance (not marked available):', ambulance.vehicleNumber);
        // Mark it as available for this request
        await db.collection('ambulances').updateOne(
          { _id: ambulance._id },
          { $set: { isAvailable: true } }
        );
      }
    }
    
    if (!ambulance) {
      const allAmbulances = await db.collection('ambulances').find({}).toArray();
      console.log('❌ No ambulance found for provider:', providerId);
      console.log('All ambulances in DB:', allAmbulances.map(a => ({ 
        providerId: a.providerId, 
        vehicle: a.vehicleNumber 
      })));
      
      return NextResponse.json({ 
        success: false, 
        error: 'No ambulance found. Please add an ambulance first.'
      }, { status: 400 });
    }
    
    console.log('✅ Using ambulance:', ambulance.vehicleNumber);

    console.log('Assigning ambulance:', ambulance.vehicleNumber, 'to booking:', requestId);

    // Update booking with driver info
    await db.collection('bookings').updateOne(
      { _id: new ObjectId(requestId) },
      { 
        $set: { 
          status: 'driver_assigned',
          assignedProviderId: providerId,
          assignedAmbulanceId: ambulance._id.toString(),
          driverInfo: {
            name: ambulance.driverName,
            phone: ambulance.driverPhone,
            vehicleNumber: ambulance.vehicleNumber
          },
          driverLocation: {
            latitude: booking.userLocation.latitude + 0.01,
            longitude: booking.userLocation.longitude + 0.01
          },
          acceptedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    // Mark ambulance as busy
    await db.collection('ambulances').updateOne(
      { _id: ambulance._id },
      { 
        $set: { 
          isAvailable: false,
          currentBookingId: requestId
        }
      }
    );

    console.log('✅ Request accepted successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Request accepted successfully'
    });

  } catch (error) {
    console.error('❌ Accept request error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
