/**
 * Real-time Tracking Data Schemas
 * Defines the structure for live ambulance tracking
 */

/**
 * LiveTrackingSession Schema
 * Represents an active tracking session for a booking
 */
export const LiveTrackingSessionSchema = {
  _id: String,
  bookingId: String, // Reference to booking
  hospitalId: String, // Reference to hospital
  providerId: String, // Reference to provider/driver
  driverId: String, // Reference to driver
  
  // Tracking state
  isActive: Boolean,
  status: String, // 'en_route', 'arrived', 'trip_started', 'completed'
  
  // Location data
  driverLocation: {
    latitude: Number,
    longitude: Number,
    heading: Number, // Direction in degrees (0-359)
    speed: Number, // Speed in km/h
    accuracy: Number, // GPS accuracy in meters
    updatedAt: Date,
  },
  
  // Destination
  destination: {
    latitude: Number,
    longitude: Number,
    address: String,
    hospitalName: String,
  },
  
  // Pickup location
  pickup: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  
  // ETA calculations
  estimatedArrival: Date,
  distanceRemaining: Number, // in meters
  durationRemaining: Number, // in seconds
  
  // Route information
  route: {
    polyline: String, // Encoded polyline for map display
    waypoints: Array, // Array of {lat, lng} coordinates
    distance: Number, // Total route distance in meters
    duration: Number, // Total route duration in seconds
  },
  
  // Metadata
  startedAt: Date,
  completedAt: Date,
  lastLocationUpdate: Date,
  createdAt: Date,
  updatedAt: Date,
};

/**
 * LocationUpdate Schema
 * Individual location update from driver
 */
export const LocationUpdateSchema = {
  _id: String,
  bookingId: String,
  driverId: String,
  providerId: String,
  
  location: {
    latitude: Number,
    longitude: Number,
    heading: Number,
    speed: Number,
    accuracy: Number,
  },
  
  // Context
  status: String, // 'moving', 'stopped', 'idle'
  batteryLevel: Number, // 0-100
  isCharging: Boolean,
  
  // Timestamps
  timestamp: Date,
  receivedAt: Date,
  createdAt: Date,
};

/**
 * TrackingNotification Schema
 * Real-time notifications for tracking events
 */
export const TrackingNotificationSchema = {
  _id: String,
  type: String, // 'driver_assigned', 'driver_en_route', 'driver_arrived', 'trip_started', 'trip_completed'
  bookingId: String,
  hospitalId: String,
  providerId: String,
  driverId: String,
  
  // Recipients
  recipientId: String, // Hospital user ID
  recipientType: String, // 'hospital', 'provider', 'seeker'
  
  // Content
  title: String,
  message: String,
  data: Object, // Additional event-specific data
  
  // Delivery status
  status: String, // 'pending', 'delivered', 'read', 'dismissed'
  deliveredAt: Date,
  readAt: Date,
  
  // Actionable
  actionRequired: Boolean,
  actionType: String, // 'open_tracking', 'confirm_arrival', etc。
  actionUrl: String,
  
  createdAt: Date,
  updatedAt: Date,
};

/**
 * Socket.io Event Schemas
 * Defines the structure for Socket.io events
 */

// Client → Server Events
export const SocketClientEvents = {
  // Authentication
  'auth:authenticate': {
    token: String,
    userType: String, // 'hospital', 'provider', 'seeker'
    userId: String,
  },
  
  // Hospital events
  'hospital:select_driver': {
    bookingId: String,
    driverId: String,
    hospitalId: String,
  },
  'hospital:subscribe_tracking': {
    bookingId: String,
  },
  'hospital:unsubscribe_tracking': {
    bookingId: String,
  },
  
  // Provider/Driver events
  'driver:accept_request': {
    bookingId: String,
    providerId: String,
    driverId: String,
  },
  'driver:update_location': {
    bookingId: String,
    location: {
      latitude: Number,
      longitude: Number,
      heading: Number,
      speed: Number,
      accuracy: Number,
    },
    status: String,
  },
  'driver:update_status': {
    bookingId: String,
    status: String, // 'en_route', 'arrived', 'trip_started', 'completed'
  },
  'driver:start_location_stream': {
    bookingId: String,
    interval: Number, // Update interval in ms
  },
  'driver:stop_location_stream': {
    bookingId: String,
  },
};

// Server → Client Events
export const SocketServerEvents = {
  // Authentication
  'auth:success': {
    userId: String,
    userType: String,
    socketId: String,
  },
  'auth:error': {
    error: String,
  },
  
  // Hospital events
  'hospital:driver_assigned': {
    bookingId: String,
    driverId: String,
    driverInfo: Object,
    estimatedArrival: Date,
  },
  'hospital:location_update': {
    bookingId: String,
    location: Object,
    distanceRemaining: Number,
    eta: Date,
  },
  'hospital:driver_status_update': {
    bookingId: String,
    status: String,
    message: String,
  },
  'hospital:tracking_started': {
    bookingId: String,
    trackingUrl: String,
  },
  
  // Provider/Driver events
  'driver:request_received': {
    bookingId: String,
    hospitalInfo: Object,
    pickupLocation: Object,
    destination: Object,
    patientInfo: Object,
  },
  'driver:location_update_ack': {
    bookingId: String,
    timestamp: Date,
  },
  
  // General events
  'error': {
    message: String,
    code: String,
  },
  'notification': {
    type: String,
    title: String,
    message: String,
    data: Object,
  },
};

/**
 * Helper function to validate location data
 */
export function validateLocation(location) {
  if (!location) return false;
  const { latitude, longitude } = location;
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * Helper function to calculate distance between two points (Haversine formula)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Helper function to estimate ETA based on distance and average speed
 */
export function estimateETA(distance, averageSpeed = 30) {
  // averageSpeed in km/h, distance in meters
  const speedInMetersPerSecond = (averageSpeed * 1000) / 3600;
  const durationInSeconds = distance / speedInMetersPerSecond;
  return new Date(Date.now() + durationInSeconds * 1000);
}
