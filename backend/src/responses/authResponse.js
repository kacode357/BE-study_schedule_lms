class AuthResponse {
  static formatLogin(token, user) {
    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: user.status,
        auth_provider: user.auth_provider,
        avatar_url: user.avatar_url,
      },
    };
  }

  static formatRegister(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
      auth_provider: user.auth_provider,
      created_at: user.created_at,
    };
  }

  static formatProfile(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
      auth_provider: user.auth_provider,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
    };
  }
}

module.exports = AuthResponse;
