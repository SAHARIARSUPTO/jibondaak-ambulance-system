// Ambulance Type Model Schema
class AmbulanceTypeModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.icon = data.icon || 'ambulance';
    this.available = data.available !== undefined ? data.available : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get default ambulance types
  static getDefaultTypes() {
    return [
      {
        id: 'non-ac',
        name: 'Non-AC Ambulance',
        description: 'Basic ambulance service with essential medical equipment',
        icon: 'ambulance',
        available: true
      },
      {
        id: 'ac',
        name: 'AC Ambulance',
        description: 'Air-conditioned ambulance with comfortable ride',
        icon: 'wind',
        available: true
      },
      {
        id: 'icu',
        name: 'ICU Ambulance',
        description: 'ICU equipped with oxygen support and life support system',
        icon: 'heart',
        available: true
      },
      {
        id: 'freezer',
        name: 'Freezer Van',
        description: 'Temperature controlled mortuary van service',
        icon: 'snowflake',
        available: true
      }
    ];
  }

  // Get all ambulance types
  static async findAll(db) {
    const collection = db.collection('ambulanceTypes');
    const types = await collection.find({ available: true }).toArray();
    
    // If no types exist, return default types
    if (types.length === 0) {
      return this.getDefaultTypes();
    }
    
    return types;
  }

  // Find ambulance type by ID
  static async findById(db, typeId) {
    const collection = db.collection('ambulanceTypes');
    return await collection.findOne({ id: typeId });
  }
}

module.exports = AmbulanceTypeModel;
