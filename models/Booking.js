// Booking Model Schema
class BookingModel {
  constructor(data) {
    this.userId = data.userId;
    this.userLocation = {
      latitude: data.userLocation.latitude,
      longitude: data.userLocation.longitude,
      address: data.userLocation.address || ''
    };
    this.driverLocation = data.driverLocation || null;
    this.status = data.status || 'searching'; // searching, driver_assigned, en_route, arrived, completed, cancelled
    this.driverInfo = data.driverInfo || null;
    this.ambulanceType = data.ambulanceType || 'basic';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validate booking data
  static validate(data) {
    const errors = [];

    if (!data.userId) {
      errors.push('User ID is required');
    }

    if (!data.userLocation || !data.userLocation.latitude || !data.userLocation.longitude) {
      errors.push('Valid user location is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Create booking in database
  static async create(db, bookingData) {
    const validation = this.validate(bookingData);
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const booking = new BookingModel(bookingData);
    const collection = db.collection('bookings');
    const result = await collection.insertOne(booking);
    
    return {
      ...booking,
      _id: result.insertedId
    };
  }

  // Find booking by ID
  static async findById(db, bookingId) {
    const { ObjectId } = require('mongodb');
    const collection = db.collection('bookings');
    return await collection.findOne({ _id: new ObjectId(bookingId) });
  }

  // Find active booking by user ID
  static async findActiveByUserId(db, userId) {
    const collection = db.collection('bookings');
    return await collection.findOne({ 
      userId,
      status: { $in: ['searching', 'driver_assigned', 'en_route', 'arrived'] }
    });
  }

  // Update booking status
  static async updateStatus(db, bookingId, status, additionalData = {}) {
    const { ObjectId } = require('mongodb');
    const collection = db.collection('bookings');
    
    return await collection.updateOne(
      { _id: new ObjectId(bookingId) },
      { 
        $set: { 
          status,
          ...additionalData,
          updatedAt: new Date()
        }
      }
    );
  }

  // Assign driver to booking
  static async assignDriver(db, bookingId, driverInfo, driverLocation) {
    const { ObjectId } = require('mongodb');
    const collection = db.collection('bookings');
    
    return await collection.updateOne(
      { _id: new ObjectId(bookingId) },
      { 
        $set: { 
          driverInfo,
          driverLocation,
          status: 'driver_assigned',
          updatedAt: new Date()
        }
      }
    );
  }

  // Update driver location
  static async updateDriverLocation(db, bookingId, driverLocation) {
    const { ObjectId } = require('mongodb');
    const collection = db.collection('bookings');
    
    return await collection.updateOne(
      { _id: new ObjectId(bookingId) },
      { 
        $set: { 
          driverLocation,
          updatedAt: new Date()
        }
      }
    );
  }
}

module.exports = BookingModel;
