// User Model Schema
class UserModel {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password; // Should be hashed
    this.role = data.role || 'user'; // user, driver, admin
    this.isVerified = data.isVerified || false;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validate user data
  static validate(data, isLogin = false) {
    const errors = [];

    if (!isLogin) {
      if (!data.name || data.name.trim().length < 2) {
        errors.push('Valid name is required (minimum 2 characters)');
      }

      if (!data.phone || !this.isValidPhone(data.phone)) {
        errors.push('Valid phone number is required');
      }
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email is required');
    }

    if (!data.password || data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Email validation
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation (Bangladesh format)
  static isValidPhone(phone) {
    const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
    return phoneRegex.test(phone);
  }

  // Create user in database
  static async create(db, userData) {
    const validation = this.validate(userData);
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if user already exists
    const collection = db.collection('users');
    const existingUser = await collection.findOne({
      $or: [
        { email: userData.email },
        { phone: userData.phone }
      ]
    });

    if (existingUser) {
      throw new Error('User with this email or phone already exists');
    }

    const user = new UserModel(userData);
    const result = await collection.insertOne(user);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    return {
      ...userWithoutPassword,
      _id: result.insertedId
    };
  }

  // Find user by email (for login)
  static async findByEmail(db, email) {
    const collection = db.collection('users');
    return await collection.findOne({ email });
  }

  // Find user by ID
  static async findById(db, userId) {
    const { ObjectId } = require('mongodb');
    const collection = db.collection('users');
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  }
}

module.exports = UserModel;
