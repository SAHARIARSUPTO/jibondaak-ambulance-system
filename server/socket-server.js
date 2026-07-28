/**
 * Socket.io Server for Real-time Ambulance Tracking
 * Run with: node server/socket-server.js
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { getDb, getBookingById, updateBookingStatus } = require('../lib/dbStore');
const {
  validateLocation,
  calculateDistance,
  estimateETA,
} = require('../lib/schemas/tracking');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Store active connections
const connectedUsers = new Map(); // userId -> { socketId, userType, socket }
const activeTrackingSessions = new Map(); // bookingId -> Set of socketIds

/**
 * Authentication middleware
 */
io.use(async (socket, next) => {
  try {
    const { token, userType, userId } = socket.handshake.auth;
    
    if (!userId || !userType) {
      return next(new Error('Authentication failed: Missing credentials'));
    }

    // In production, validate token here
    // For now, accept the credentials
    
    socket.data.userId = userId;
    socket.data.userType = userType;
    socket.data.socketId = socket.id;
    
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

/**
 * Connection handler
 */
io.on('connection', (socket) => {
  const { userId, userType, socketId } = socket.data;
  
  console.log(`User connected: ${userId} (${userType}) - Socket: ${socketId}`);
  
  // Store connection
  connectedUsers.set(userId, {
    socketId,
    userType,
    socket,
  });

  // Send success acknowledgment
  socket.emit('auth:success', {
    userId,
    userType,
    socketId,
  });

  // Join provider-specific room for receiving trip requests
  if (userType === 'provider') {
    const roomName = `provider_${userId}`;
    socket.join(roomName);
    console.log(`Provider ${userId} joined room: ${roomName}`);
  }

  /**
   * Provider: Receive new trip request (from booking creation API)
   */
  socket.on('provider:new_trip_request', (data) => {
    const { providerId, bookingId, booking } = data;
    
    if (!providerId || !bookingId) {
      console.error('Invalid trip request data:', data);
      return;
    }

    // Emit to the specific provider's room
    const roomName = `provider_${providerId}`;
    io.to(roomName).emit('provider:new_trip_request', {
      bookingId,
      providerId,
      booking,
      timestamp: new Date(),
    });
    
    console.log(`Trip request sent to room: ${roomName}`);
  });

  /**
   * Hospital: Select driver for booking
   */
  socket.on('hospital:select_driver', async (data) => {
    try {
      const { bookingId, driverId, hospitalId } = data;
      
      if (!bookingId || !driverId || !hospitalId) {
        socket.emit('error', { message: 'Missing required fields' });
        return;
      }

      // Find the booking
      const booking = await getBookingById(bookingId);
      if (!booking) {
        socket.emit('error', { message: 'Booking not found' });
        return;
      }

      // Find the driver's socket connection
      const driverConnection = Array.from(connectedUsers.values()).find(
        conn => conn.userType === 'provider' && conn.userId === driverId
      );

      if (driverConnection) {
        // Send request to driver
        driverConnection.socket.emit('driver:request_received', {
          bookingId,
          hospitalInfo: {
            id: hospitalId,
            name: booking.hospitalName || 'Hospital',
          },
          pickupLocation: booking.pickupLocation || booking.userLocation,
          destination: booking.destination,
          patientInfo: booking.patientInfo,
        });
      }

      socket.emit('hospital:driver_assigned', {
        bookingId,
        driverId,
        status: 'pending',
      });
    } catch (error) {
      console.error('Error in hospital:select_driver:', error);
      socket.emit('error', { message: 'Failed to select driver' });
    }
  });

  /**
   * Hospital: Subscribe to tracking updates
   */
  socket.on('hospital:subscribe_tracking', (data) => {
    const { bookingId } = data;
    
    if (!bookingId) {
      socket.emit('error', { message: 'Booking ID required' });
      return;
    }

    // Add socket to tracking session
    if (!activeTrackingSessions.has(bookingId)) {
      activeTrackingSessions.set(bookingId, new Set());
    }
    activeTrackingSessions.get(bookingId).add(socket.id);
    
    socket.emit('hospital:tracking_started', {
      bookingId,
      trackingUrl: `/tracking/${bookingId}`,
    });
  });

  /**
   * Hospital: Unsubscribe from tracking updates
   */
  socket.on('hospital:unsubscribe_tracking', (data) => {
    const { bookingId } = data;
    
    if (activeTrackingSessions.has(bookingId)) {
      activeTrackingSessions.get(bookingId).delete(socket.id);
      
      // Clean up if no more subscribers
      if (activeTrackingSessions.get(bookingId).size === 0) {
        activeTrackingSessions.delete(bookingId);
      }
    }
  });

  /**
   * Driver: Accept booking request
   */
  socket.on('driver:accept_request', async (data) => {
    try {
      const { bookingId, providerId, driverId } = data;
      
      if (!bookingId || !providerId || !driverId) {
        socket.emit('error', { message: 'Missing required fields' });
        return;
      }

      // Update booking status
      const updatedBooking = await updateBookingStatus(
        bookingId,
        'driver_assigned',
        {
          providerId,
          driverId,
          acceptedAt: new Date(),
        }
      );

      if (!updatedBooking) {
        socket.emit('error', { message: 'Booking not found or already accepted' });
        return;
      }

      // Notify hospital subscribers
      if (activeTrackingSessions.has(bookingId)) {
        const subscribers = activeTrackingSessions.get(bookingId);
        subscribers.forEach(socketId => {
          const subscriberSocket = io.sockets.sockets.get(socketId);
          if (subscriberSocket) {
            subscriberSocket.emit('hospital:driver_assigned', {
              bookingId,
              driverId,
              driverInfo: updatedBooking.driverInfo,
              estimatedArrival: updatedBooking.estimatedArrival,
            });
          }
        });
      }

      socket.emit('driver:request_accepted', {
        bookingId,
        status: 'driver_assigned',
      });
    } catch (error) {
      console.error('Error in driver:accept_request:', error);
      socket.emit('error', { message: 'Failed to accept request' });
    }
  });

  /**
   * Driver: Update location
   */
  socket.on('driver:update_location', async (data) => {
    try {
      const { bookingId, location, status } = data;
      
      if (!bookingId || !location) {
        socket.emit('error', { message: 'Missing required fields' });
        return;
      }

      // Validate location
      if (!validateLocation(location)) {
        socket.emit('error', { message: 'Invalid location data' });
        return;
      }

      // Get booking to calculate distance
      const booking = await getBookingById(bookingId);
      if (!booking) {
        socket.emit('error', { message: 'Booking not found' });
        return;
      }

      // Calculate distance to destination
      const destination = booking.destination || booking.userLocation;
      const distanceRemaining = calculateDistance(
        location.latitude,
        location.longitude,
        destination.latitude,
        destination.longitude
      );

      // Estimate ETA
      const eta = estimateETA(distanceRemaining, location.speed || 30);

      // Broadcast to hospital subscribers
      if (activeTrackingSessions.has(bookingId)) {
        const subscribers = activeTrackingSessions.get(bookingId);
        subscribers.forEach(socketId => {
          const subscriberSocket = io.sockets.sockets.get(socketId);
          if (subscriberSocket) {
            subscriberSocket.emit('hospital:location_update', {
              bookingId,
              location: {
                ...location,
                updatedAt: new Date(),
              },
              distanceRemaining,
              eta,
            });
          }
        });
      }

      socket.emit('driver:location_update_ack', {
        bookingId,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error in driver:update_location:', error);
      socket.emit('error', { message: 'Failed to update location' });
    }
  });

  /**
   * Driver: Update status
   */
  socket.on('driver:update_status', async (data) => {
    try {
      const { bookingId, status } = data;
      
      if (!bookingId || !status) {
        socket.emit('error', { message: 'Missing required fields' });
        return;
      }

      const validStatuses = ['en_route', 'arrived', 'trip_started', 'completed'];
      if (!validStatuses.includes(status)) {
        socket.emit('error', { message: 'Invalid status' });
        return;
      }

      // Update booking status
      const updatedBooking = await updateBookingStatus(bookingId, status);

      if (!updatedBooking) {
        socket.emit('error', { message: 'Booking not found' });
        return;
      }

      // Notify hospital subscribers
      if (activeTrackingSessions.has(bookingId)) {
        const subscribers = activeTrackingSessions.get(bookingId);
        subscribers.forEach(socketId => {
          const subscriberSocket = io.sockets.sockets.get(socketId);
          if (subscriberSocket) {
            subscriberSocket.emit('hospital:driver_status_update', {
              bookingId,
              status,
              message: getStatusMessage(status),
            });
          }
        });
      }

      socket.emit('driver:status_update_ack', {
        bookingId,
        status,
      });
    } catch (error) {
      console.error('Error in driver:update_status:', error);
      socket.emit('error', { message: 'Failed to update status' });
    }
  });

  /**
   * Driver: Start location streaming
   */
  socket.on('driver:start_location_stream', (data) => {
    const { bookingId, interval = 5000 } = data;
    
    // Store streaming interval
    socket.data.streamingInterval = setInterval(() => {
      // In production, this would trigger GPS polling
      // For now, emit a placeholder event
      socket.emit('stream:tick', { bookingId, timestamp: new Date() });
    }, interval);
  });

  /**
   * Driver: Stop location streaming
   */
  socket.on('driver:stop_location_stream', () => {
    if (socket.data.streamingInterval) {
      clearInterval(socket.data.streamingInterval);
      delete socket.data.streamingInterval;
    }
  });

  /**
   * Disconnect handler
   */
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userId} (${userType})`);
    
    // Remove from connected users
    connectedUsers.delete(userId);
    
    // Remove from all tracking sessions
    activeTrackingSessions.forEach((sockets, bookingId) => {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        activeTrackingSessions.delete(bookingId);
      }
    });
    
    // Clear streaming interval if exists
    if (socket.data.streamingInterval) {
      clearInterval(socket.data.streamingInterval);
    }
  });
});

/**
 * Helper function to get status message
 */
function getStatusMessage(status) {
  const messages = {
    en_route: 'Driver is on the way to pickup location',
    arrived: 'Driver has arrived at pickup location',
    trip_started: 'Trip has started',
    completed: 'Trip has been completed',
  };
  return messages[status] || 'Status updated';
}

/**
 * Start server
 */
const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});

/**
 * Graceful shutdown
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };
