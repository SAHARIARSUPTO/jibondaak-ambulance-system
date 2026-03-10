/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // in km
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate ETA (Estimated Time of Arrival)
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} avgSpeedKmh - Average speed in km/h (default: 40 km/h for Dhaka traffic)
 * @returns {object} - { minutes, formattedTime }
 */
export function calculateETA(distanceKm, avgSpeedKmh = 40) {
  const hours = distanceKm / avgSpeedKmh;
  const minutes = Math.ceil(hours * 60);
  
  if (minutes < 60) {
    return {
      minutes,
      formattedTime: `${minutes} min`
    };
  } else {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return {
      minutes,
      formattedTime: `${hrs}h ${mins}m`
    };
  }
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  } else {
    return `${distanceKm.toFixed(1)} km`;
  }
}

/**
 * Get user's current location
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        // Default to Dhaka if permission denied
        console.warn('Location permission denied, using default location');
        resolve({
          latitude: 23.8103,
          longitude: 90.4125
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}
