const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const MESSAGES = require("../constants/messages");

const generateJWT = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

class AuthService {
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error(MESSAGES.AUTH.EMAIL_NOT_EXIST);

    // Tài khoản Google không được đăng nhập local
    if (user.auth_provider === "google") {
      throw new Error(MESSAGES.AUTH.USE_GOOGLE_LOGIN);
    }

    // Kiểm tra trạng thái tài khoản
    if (user.status === "pending_approval") {
      throw new Error(MESSAGES.AUTH.ACCOUNT_PENDING_APPROVAL);
    }
    if (user.status === "pending_email_verification") {
      throw new Error(MESSAGES.AUTH.ACCOUNT_PENDING_EMAIL);
    }
    if (user.status === "rejected") {
      throw new Error(MESSAGES.AUTH.ACCOUNT_REJECTED);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error(MESSAGES.AUTH.INCORRECT_PASSWORD);

    const token = generateJWT(user);
    return { token, user };
  }

  async register({ username, email, password, full_name, role }) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) throw new Error(MESSAGES.AUTH.EMAIL_IN_USE);

    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error(MESSAGES.AUTH.USERNAME_IN_USE);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      full_name,
      role: role || "student",
      status: "pending_approval",
    });

    return newUser;
  }

  async getMyProfile(userId) {
    const user = await User.findById(userId).select(
      "-password -email_verify_token -email_verify_expires"
    );
    if (!user) throw new Error(MESSAGES.AUTH.EMAIL_NOT_EXIST);
    return user;
  }

  /**
   * Xác thực email qua token
   */
  async verifyEmail(token) {
    const user = await User.findOne({
      email_verify_token: token,
      email_verify_expires: { $gt: new Date() }, // chưa hết hạn
    });
    if (!user) throw new Error(MESSAGES.AUTH.VERIFY_TOKEN_INVALID);

    user.status = "active";
    user.email_verify_token = null;
    user.email_verify_expires = null;
    await user.save();

    return user;
  }

  /**
   * Tạo token xác thực email (dùng nội bộ bởi adminService)
   */
  generateEmailVerifyToken() {
    return crypto.randomBytes(32).toString("hex");
  }
}

module.exports = new AuthService();
