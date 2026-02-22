// Hospital Model Schema
class HospitalModel {
  constructor(data) {
    this.name = data.name;
    this.phone = data.phone;
    this.address = data.address;
    this.location = {
      latitude: data.location.latitude,
      longitude: data.location.longitude
    };
    this.type = data.type || 'general'; // general, specialized, emergency
    this.available24x7 = data.available24x7 !== undefined ? data.available24x7 : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get default hospitals
  static getDefaultHospitals() {
    return [
      {
        name: 'Dhaka Medical College Hospital',
        phone: '02-9668690',
        address: 'Secretariat Road, Dhaka 1000',
        location: { latitude: 23.7261, longitude: 90.3967 },
        type: 'general',
        available24x7: true
      },
      {
        name: 'Square Hospital',
        phone: '09666-771100',
        address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205',
        location: { latitude: 23.7515, longitude: 90.3860 },
        type: 'specialized',
        available24x7: true
      },
      {
        name: 'United Hospital',
        phone: '09666-710678',
        address: 'Plot 15, Road 71, Gulshan, Dhaka 1212',
        location: { latitude: 23.7925, longitude: 90.4078 },
        type: 'specialized',
        available24x7: true
      },
      {
        name: 'Labaid Hospital',
        phone: '09666-710678',
        address: 'House 1, Road 4, Dhanmondi, Dhaka 1205',
        location: { latitude: 23.7461, longitude: 90.3742 },
        type: 'general',
        available24x7: true
      }
    ];
  }

  // Calculate distance from user location
  static calculateDistance(loc1, loc2) {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
    const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Find nearby hospitals
  static async findNearby(db, userLocation, limit = 10) {
    const collection = db.collection('hospitals');
    let hospitals = await collection.find({ available24x7: true }).toArray();
    
    // If no hospitals exist, return default hospitals
    if (hospitals.length === 0) {
      hospitals = this.getDefaultHospitals();
    }

    // Calculate distance and sort
    hospitals = hospitals.map(hospital => ({
      ...hospital,
      distance: this.calculateDistance(userLocation, hospital.location)
    }));

    // Sort by distance
    hospitals.sort((a, b) => a.distance - b.distance);

    return hospitals.slice(0, limit);
  }

  // Get all hospitals
  static async findAll(db) {
    const collection = db.collection('hospitals');
    const hospitals = await collection.find({}).toArray();
    
    if (hospitals.length === 0) {
      return this.getDefaultHospitals();
    }
    
    return hospitals;
  }
}

module.exports = HospitalModel;
