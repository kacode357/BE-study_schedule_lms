const MESSAGES = {
  AUTH: {
    // Validation
    USERNAME_REQUIRED: "Username is required",
    EMAIL_REQUIRED: "Email is required",
    INVALID_EMAIL: "Invalid email format",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_LENGTH: "Password must be at least 6 characters",
    FULLNAME_REQUIRED: "Full name is required",
    INVALID_ROLE: "Role must be one of: teacher, student",
    GOOGLE_TOKEN_REQUIRED: "Google ID token is required",

    // Logic Errors
    EMAIL_NOT_EXIST: "Email does not exist",
    INCORRECT_PASSWORD: "Incorrect password",
    EMAIL_IN_USE: "Email is already in use",
    USERNAME_IN_USE: "Username is already in use",
    USE_GOOGLE_LOGIN: "This account was registered with Google. Please login with Google",
    GOOGLE_EMAIL_CONFLICT: "This email is already registered with a local account. Please login with email and password",

    // Status Errors
    ACCOUNT_PENDING_APPROVAL: "Your account is waiting for admin approval",
    ACCOUNT_PENDING_EMAIL: "Please verify your email. Check your inbox for the verification link",
    ACCOUNT_REJECTED: "Your account registration has been rejected",
    ACCOUNT_INACTIVE: "Your account has been deactivated",

    // Email Verify
    VERIFY_TOKEN_INVALID: "Verification link is invalid or has expired",
    EMAIL_VERIFIED: "Email verified successfully. You can now login",

    // Middleware
    TOKEN_MISSING: "Authentication token is missing",
    TOKEN_INVALID: "Token is invalid or expired",
    FORBIDDEN: "Forbidden access",

    // Success
    REGISTER_PENDING: "Registration successful. Please wait for admin approval",
    LOGIN_SUCCESS: "Login successful",
  },

  ADMIN: {
    USER_NOT_FOUND: "User not found",
    INVALID_STATUS_FOR_APPROVE: "User is not in pending_approval status",
    INVALID_STATUS_FOR_REJECT: "User is not in pending_approval status",
    APPROVE_SUCCESS: "User approved and verification email sent",
    REJECT_SUCCESS: "User rejected and notified by email",
  },

  SYSTEM: {
    INTERNAL_ERROR: "Internal Server Error",
  },
};

module.exports = MESSAGES;
