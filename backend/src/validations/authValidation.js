const MESSAGES = require('../constants/messages');

class AuthValidation {
  static validateLogin(body) {
    const errors = [];
    if (!body.email) {
      errors.push({ field: 'email', message: MESSAGES.AUTH.EMAIL_REQUIRED });
    }
    if (!body.password) {
      errors.push({ field: 'password', message: MESSAGES.AUTH.PASSWORD_REQUIRED });
    }
    return errors;
  }

  static validateRegister(body) {
    const errors = [];
    if (!body.email) {
      errors.push({ field: 'email', message: MESSAGES.AUTH.EMAIL_REQUIRED });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push({ field: 'email', message: MESSAGES.AUTH.INVALID_EMAIL });
    }

    if (!body.password) {
      errors.push({ field: 'password', message: MESSAGES.AUTH.PASSWORD_REQUIRED });
    } else if (body.password.length < 6) {
      errors.push({ field: 'password', message: MESSAGES.AUTH.PASSWORD_LENGTH });
    }

    if (!body.fullName) {
      errors.push({ field: 'fullName', message: MESSAGES.AUTH.FULLNAME_REQUIRED });
    }

    if (body.role && !['ADMIN', 'TEACHER', 'STUDENT'].includes(body.role)) {
      errors.push({ field: 'role', message: MESSAGES.AUTH.INVALID_ROLE });
    }

    return errors;
  }
}

module.exports = AuthValidation;
