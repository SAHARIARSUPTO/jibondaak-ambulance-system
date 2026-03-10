# 🗺️ Map & ETA Implementation Guide

## ✅ Already Done

1. **Map Component** - `app/components/Map.jsx`
   - Shows user location (red marker)
   - Shows ambulance location (blue marker)
   - Uses Leaflet + OpenStreetMap

2. **Map Utilities** - `lib/mapUtils.js`
   - `calculateDistance()` - Distance between two points
   - `calculateETA()` - Estimated time of arrival
   - `formatDistance()` - Format distance for display
   - `getCurrentLocation()` - Get user's GPS location

3. **Packages Installed**
   - `leaflet` - Map library
   - `react-leaflet` - React wrapper for Leaflet

## 🔄 Next Steps

### Step 1: Update User Dashboard (`app/dashboard/page.jsx`)

Add map and ETA display when driver is assigned:

```javascript
import Map from '@/app/components/Map';
import { calculateDistance, calculateETA, formatDistance } from '@/lib/mapUtils';

// In component:
const [distance, setDistance] = useState(null);
const [eta, setETA] = useState(null);

// Calculate distance and ETA when booking updates
useEffect(() => {
  if (activeBooking && activeBooking.driverLocation && activeBooking.userLocation) {
    const dist = calculateDistance(
      activeBooking.userLocation.latitude,
      activeBooking.userLocation.longitude,
      activeBooking.driverLocation.latitude,
      activeBooking.driverLocation.longitude
    );
    setDistance(dist);
    
    const etaData = calculateETA(dist);
    setETA(etaData);
  }
}, [activeBooking]);

// In JSX:
{activeBooking && activeBooking.status !== 'searching' && (
  <div>
    <Map 
      userLocation={activeBooking.userLocation}
      ambulanceLocation={activeBooking.driverLocation}
      showAmbulance={true}
      height="500px"
    />
    
    {distance && eta && (
      <div className="mt-4 p-4 bg-blue-900/30 rounded-lg">
        <p>Distance: {formatDistance(distance)}</p>
        <p>ETA: {eta.formattedTime}</p>
      </div>
    )}
  </div>
)}
```

### Step 2: Update Provider Emergency Page (`app/provider-dashboard/emergency/page.jsx`)

Get provider location before accepting:

```javascript
import { getCurrentLocation } from '@/lib/mapUtils';

const handleAcceptRequest = async (requestId) => {
  // ... existing code ...
  
  // Get provider's current location
  const providerLocation = await getCurrentLocation();
  
  const response = await fetch('/api/provider/accept-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      requestId, 
      providerId: provider._id,
      ambulanceLocation: providerLocation // Send location
    })
  });
  
  // ... rest of code ...
};
```

### Step 3: Show Distance in Emergency Requests

Calculate distance for each request:

```javascript
import { calculateDistance, formatDistance, calculateETA } from '@/lib/mapUtils';

// For each request, calculate distance
{incomingRequests.map((request) => {
  const dist = calculateDistance(
    providerLocation.latitude,
    providerLocation.longitude,
    request.userLocation.latitude,
    request.userLocation.longitude
  );
  const eta = calculateETA(dist);
  
  return (
    <div key={request._id}>
      {/* ... existing request card ... */}
      <p>Distance: {formatDistance(dist)}</p>
      <p>ETA: {eta.formattedTime}</p>
    </div>
  );
})}
```

### Step 4: Add CSS for Leaflet

Add to `app/globals.css`:

```css
/* Leaflet Map Styles */
.leaflet-container {
  font-family: inherit;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
}
```

## 📊 Data Flow

```
User clicks SOS
  ↓
User location saved in booking
  ↓
Provider sees request with distance/ETA
  ↓
Provider accepts (sends their location)
  ↓
Booking updated with driverLocation
  ↓
User sees map with both locations + ETA
  ↓
Provider can update location (future feature)
```

## 🎯 Features

1. **Real-time Distance** - Calculate distance between user and ambulance
2. **ETA Display** - Show estimated arrival time
3. **Visual Map** - See both locations on map
4. **Auto-update** - Polling updates location every 5s (user) / 3s (provider)

## 🚀 To Implement

Run these commands:

```bash
# Already done - packages installed
npm install leaflet react-leaflet

# Start dev server
npm run dev
```

Then update the files as mentioned in Steps 1-3 above.

## 📝 Notes

- Default location: Dhaka (23.8103, 90.4125)
- Average speed: 40 km/h (Dhaka traffic)
- Map provider: OpenStreetMap (free)
- Distance formula: Haversine (accurate for Earth)
