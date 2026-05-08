const MESSAGES = {
  AUTH: {
    // Validation Errors
    EMAIL_REQUIRED: 'Email is required',
    INVALID_EMAIL: 'Invalid email format',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_LENGTH: 'Password must be at least 6 characters',
    FULLNAME_REQUIRED: 'Full name is required',
    INVALID_ROLE: 'Invalid role provided',

    // Logic Errors
    EMAIL_NOT_EXIST: 'Email does not exist',
    INCORRECT_PASSWORD: 'Incorrect password',
    EMAIL_IN_USE: 'Email is already in use',

    // Middleware Errors
    TOKEN_MISSING: 'Authentication token is missing',
    TOKEN_INVALID: 'Token is invalid or expired',
    FORBIDDEN: 'Forbidden access',
    
    // Success Messages
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Registration successful'
  },
  SYSTEM: {
    INTERNAL_ERROR: 'Internal Server Error'
  }
};

module.exports = MESSAGES;
