// Bed Availability Model Schema
class BedAvailabilityModel {
  constructor(data) {
    this.hospitalId = data.hospitalId;
    this.hospitalName = data.hospitalName;
    this.generalBeds = data.generalBeds || 0;
    this.icuBeds = data.icuBeds || 0;
    this.oxygenBeds = data.oxygenBeds || 0;
    this.ventilatorBeds = data.ventilatorBeds || 0;
    this.emergencyBeds = data.emergencyBeds || 0;
    this.lastUpdated = data.lastUpdated || new Date();
    this.updatedBy = data.updatedBy || 'admin';
  }

  // Get all bed availability
  static async findAll(db) {
    const collection = db.collection('bedAvailability');
    const beds = await collection.find({}).toArray();
    
    // If no data, return default
    if (beds.length === 0) {
      return this.getDefaultBedAvailability();
    }
    
    return beds;
  }

  // Get default bed availability
  static getDefaultBedAvailability() {
    return [
      {
        hospitalId: 'dmch',
        hospitalName: 'Dhaka Medical College Hospital',
        generalBeds: 15,
        icuBeds: 3,
        oxygenBeds: 8,
        ventilatorBeds: 2,
        emergencyBeds: 10,
        lastUpdated: new Date()
      },
      {
        hospitalId: 'square',
        hospitalName: 'Square Hospital',
        generalBeds: 20,
        icuBeds: 5,
        oxygenBeds: 12,
        ventilatorBeds: 4,
        emergencyBeds: 8,
        lastUpdated: new Date()
      },
      {
        hospitalId: 'united',
        hospitalName: 'United Hospital',
        generalBeds: 18,
        icuBeds: 6,
        oxygenBeds: 10,
        ventilatorBeds: 5,
        emergencyBeds: 12,
        lastUpdated: new Date()
      },
      {
        hospitalId: 'labaid',
        hospitalName: 'Labaid Hospital',
        generalBeds: 12,
        icuBeds: 4,
        oxygenBeds: 7,
        ventilatorBeds: 3,
        emergencyBeds: 6,
        lastUpdated: new Date()
      }
    ];
  }

  // Find by hospital ID
  static async findByHospitalId(db, hospitalId) {
    const collection = db.collection('bedAvailability');
    return await collection.findOne({ hospitalId });
  }

  // Update bed availability
  static async update(db, hospitalId, bedData) {
    const collection = db.collection('bedAvailability');
    
    return await collection.updateOne(
      { hospitalId },
      { 
        $set: { 
          ...bedData,
          lastUpdated: new Date()
        }
      },
      { upsert: true }
    );
  }
}

module.exports = BedAvailabilityModel;
