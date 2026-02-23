// First Aid Guide Model Schema
class FirstAidGuideModel {
  constructor(data) {
    this.title = data.title;
    this.category = data.category;
    this.icon = data.icon || 'heart-pulse';
    this.steps = data.steps || [];
    this.priority = data.priority || 'medium'; // high, medium, low
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get default first aid guides
  static getDefaultGuides() {
    return [
      {
        title: 'Heart Attack',
        category: 'cardiac',
        icon: 'heart',
        priority: 'high',
        steps: [
          'Call emergency services immediately (999)',
          'Help the person sit down and rest',
          'Give aspirin if available (chew, don\'t swallow)',
          'Loosen tight clothing',
          'Stay calm and reassure the person',
          'Be ready to perform CPR if needed'
        ]
      },
      {
        title: 'Severe Bleeding',
        category: 'injury',
        icon: 'droplet',
        priority: 'high',
        steps: [
          'Call emergency services (999)',
          'Apply direct pressure to the wound',
          'Use a clean cloth or bandage',
          'Keep pressure for at least 10 minutes',
          'Elevate the injured area above heart level',
          'Don\'t remove the cloth if blood soaks through'
        ]
      },
      {
        title: 'Choking',
        category: 'breathing',
        icon: 'wind',
        priority: 'high',
        steps: [
          'Encourage coughing if person can breathe',
          'Give 5 back blows between shoulder blades',
          'Give 5 abdominal thrusts (Heimlich maneuver)',
          'Repeat back blows and abdominal thrusts',
          'Call 999 if obstruction doesn\'t clear',
          'Continue until help arrives'
        ]
      },
      {
        title: 'Unconsciousness',
        category: 'emergency',
        icon: 'alert-circle',
        priority: 'high',
        steps: [
          'Check if person is breathing',
          'Call emergency services (999)',
          'Place in recovery position if breathing',
          'Start CPR if not breathing',
          'Don\'t give anything by mouth',
          'Stay with person until help arrives'
        ]
      },
      {
        title: 'Burns',
        category: 'injury',
        icon: 'flame',
        priority: 'medium',
        steps: [
          'Remove from heat source immediately',
          'Cool the burn with running water for 10-20 minutes',
          'Remove jewelry and tight clothing',
          'Cover with clean, dry cloth',
          'Don\'t apply ice, butter, or ointments',
          'Seek medical help for severe burns'
        ]
      },
      {
        title: 'Fracture',
        category: 'injury',
        icon: 'bone',
        priority: 'medium',
        steps: [
          'Don\'t move the injured area',
          'Immobilize the fracture',
          'Apply ice pack to reduce swelling',
          'Call emergency services for severe fractures',
          'Don\'t try to realign the bone',
          'Keep person warm and comfortable'
        ]
      }
    ];
  }

  // Get all first aid guides
  static async findAll(db) {
    const collection = db.collection('firstAidGuides');
    const guides = await collection.find({}).sort({ priority: -1 }).toArray();
    
    if (guides.length === 0) {
      return this.getDefaultGuides();
    }
    
    return guides;
  }

  // Find guides by category
  static async findByCategory(db, category) {
    const collection = db.collection('firstAidGuides');
    const guides = await collection.find({ category }).toArray();
    
    if (guides.length === 0) {
      return this.getDefaultGuides().filter(g => g.category === category);
    }
    
    return guides;
  }
}

module.exports = FirstAidGuideModel;
