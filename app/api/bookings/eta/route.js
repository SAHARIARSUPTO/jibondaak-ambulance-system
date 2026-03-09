import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userLocation, driverLocation } = body;

    if (!userLocation || !driverLocation) {
      return NextResponse.json({ 
        success: false, 
        error: 'User and driver locations are required' 
      }, { status: 400 });
    }

    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (driverLocation.latitude - userLocation.latitude) * Math.PI / 180;
    const dLon = (driverLocation.longitude - userLocation.longitude) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(driverLocation.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Estimate time (assuming average speed of 30 km/h in city traffic)
    const averageSpeed = 30; // km/h
    const timeInHours = distance / averageSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);

    return NextResponse.json({ 
      success: true, 
      distance: distance.toFixed(2),
      eta: timeInMinutes,
      message: `Ambulance is ${distance.toFixed(1)}km away (Approx ${timeInMinutes} mins)`
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
