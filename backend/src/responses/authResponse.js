class AuthResponse {
  /**
   * Format Login Response Data
   * Strips out any unwanted info (if any) and formats exactly what FE needs.
   */
  static formatLogin(token, user) {
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    };
  }

  /**
   * Format Register Response Data
   * Typically identical to login's user object without token.
   */
  static formatRegister(user) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    };
  }
  /**
   * Format My Profile Response Data
   */
  static formatProfile(user) {
    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

module.exports = AuthResponse;
