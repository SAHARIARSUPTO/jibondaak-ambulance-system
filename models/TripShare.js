// Trip Share Model Schema
class TripShareModel {
  constructor(data) {
    this.bookingId = data.bookingId;
    this.shareToken = data.shareToken;
    this.sharedBy = data.sharedBy;
    this.sharedWith = data.sharedWith || []; // Array of phone numbers or emails
    this.expiresAt = data.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
  }

  // Generate unique share token
  static generateShareToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Create trip share
  static async create(db, shareData) {
    if (!shareData.bookingId || !shareData.sharedBy) {
      throw new Error('Booking ID and user ID are required');
    }

    const shareToken = this.generateShareToken();
    
    const tripShare = new TripShareModel({
      ...shareData,
      shareToken
    });

    const collection = db.collection('tripShares');
    const result = await collection.insertOne(tripShare);
    
    return {
      ...tripShare,
      _id: result.insertedId
    };
  }

  // Find by share token
  static async findByToken(db, shareToken) {
    const collection = db.collection('tripShares');
    return await collection.findOne({ 
      shareToken,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });
  }

  // Find by booking ID
  static async findByBookingId(db, bookingId) {
    const collection = db.collection('tripShares');
    return await collection.findOne({ 
      bookingId,
      isActive: true
    });
  }

  // Deactivate share
  static async deactivate(db, shareToken) {
    const collection = db.collection('tripShares');
    
    return await collection.updateOne(
      { shareToken },
      { 
        $set: { 
          isActive: false
        }
      }
    );
  }
}

module.exports = TripShareModel;
