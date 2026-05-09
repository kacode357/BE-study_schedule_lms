const MESSAGES = require("../constants/messages");

class AuthValidation {
  static validateLogin(body) {
    const errors = [];
    if (!body.email) {
      errors.push({ field: "email", message: MESSAGES.AUTH.EMAIL_REQUIRED });
    }
    if (!body.password) {
      errors.push({ field: "password", message: MESSAGES.AUTH.PASSWORD_REQUIRED });
    }
    return errors;
  }

  static validateRegister(body) {
    const errors = [];

    if (!body.username) {
      errors.push({ field: "username", message: MESSAGES.AUTH.USERNAME_REQUIRED });
    }

    if (!body.email) {
      errors.push({ field: "email", message: MESSAGES.AUTH.EMAIL_REQUIRED });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push({ field: "email", message: MESSAGES.AUTH.INVALID_EMAIL });
    }

    if (!body.password) {
      errors.push({ field: "password", message: MESSAGES.AUTH.PASSWORD_REQUIRED });
    } else if (body.password.length < 6) {
      errors.push({ field: "password", message: MESSAGES.AUTH.PASSWORD_LENGTH });
    }

    if (!body.full_name) {
      errors.push({ field: "full_name", message: MESSAGES.AUTH.FULLNAME_REQUIRED });
    }

    // Không cho phép đăng ký role admin qua API
    if (body.role && !["teacher", "student"].includes(body.role)) {
      errors.push({ field: "role", message: MESSAGES.AUTH.INVALID_ROLE });
    }

    return errors;
  }
}

module.exports = AuthValidation;
