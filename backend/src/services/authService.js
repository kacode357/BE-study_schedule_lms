const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');
const MESSAGES = require('../constants/messages');

class AuthService {
  async login(email, password) {
    const db = getDB();
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      throw new Error(MESSAGES.AUTH.EMAIL_NOT_EXIST);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error(MESSAGES.AUTH.INCORRECT_PASSWORD);
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user };
  }

  async register({ email, password, fullName, role }) {
    const db = getDB();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      throw new Error(MESSAGES.AUTH.EMAIL_IN_USE);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.collection('users').insertOne({
      email,
      passwordHash,
      fullName,
      role: role || 'STUDENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newUser = await db.collection('users').findOne({ _id: result.insertedId });
    return newUser;
  }
}

module.exports = new AuthService();
