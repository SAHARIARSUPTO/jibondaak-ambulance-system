// Triage Form Model Schema
class TriageFormModel {
  constructor(data) {
    this.bookingId = data.bookingId;
    this.patientAge = data.patientAge;
    this.patientGender = data.patientGender;
    this.symptoms = data.symptoms || [];
    this.additionalNotes = data.additionalNotes || '';
    this.sharedWithDriver = data.sharedWithDriver || false;
    this.sharedWithHospital = data.sharedWithHospital || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Common symptoms list
  static getCommonSymptoms() {
    return [
      { id: 'heart_attack', name: 'Heart Attack', priority: 'critical' },
      { id: 'accident', name: 'Accident/Injury', priority: 'critical' },
      { id: 'pregnancy', name: 'Pregnancy Emergency', priority: 'critical' },
      { id: 'breathing', name: 'Breathing Problem', priority: 'high' },
      { id: 'stroke', name: 'Stroke', priority: 'critical' },
      { id: 'unconscious', name: 'Unconscious', priority: 'critical' },
      { id: 'bleeding', name: 'Severe Bleeding', priority: 'high' },
      { id: 'burn', name: 'Burn', priority: 'medium' },
      { id: 'fracture', name: 'Fracture', priority: 'medium' },
      { id: 'other', name: 'Other Emergency', priority: 'medium' }
    ];
  }

  // Validate triage form data
  static validate(data) {
    const errors = [];

    if (!data.bookingId) {
      errors.push('Booking ID is required');
    }

    if (!data.patientAge || data.patientAge < 0 || data.patientAge > 150) {
      errors.push('Valid patient age is required');
    }

    if (!data.patientGender || !['male', 'female', 'other'].includes(data.patientGender)) {
      errors.push('Valid patient gender is required');
    }

    if (!data.symptoms || data.symptoms.length === 0) {
      errors.push('At least one symptom is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Create triage form
  static async create(db, triageData) {
    const validation = this.validate(triageData);
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const triageForm = new TriageFormModel(triageData);
    const collection = db.collection('triageForms');
    const result = await collection.insertOne(triageForm);
    
    return {
      ...triageForm,
      _id: result.insertedId
    };
  }

  // Find by booking ID
  static async findByBookingId(db, bookingId) {
    const collection = db.collection('triageForms');
    return await collection.findOne({ bookingId });
  }

  // Update share status
  static async updateShareStatus(db, bookingId, sharedWithDriver, sharedWithHospital) {
    const collection = db.collection('triageForms');
    
    return await collection.updateOne(
      { bookingId },
      { 
        $set: { 
          sharedWithDriver,
          sharedWithHospital,
          updatedAt: new Date()
        }
      }
    );
  }
}

module.exports = TriageFormModel;
