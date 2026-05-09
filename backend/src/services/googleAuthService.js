const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userModel");
const MESSAGES = require("../constants/messages");

const CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  "1064673826920-9b4e579lg96tf2giiuobfjd5agjptb1u.apps.googleusercontent.com";

const client = new OAuth2Client(CLIENT_ID);

/**
 * Xác minh Google ID token từ frontend
 * @returns payload { sub, email, name, picture, email_verified }
 */
const verifyGoogleToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  return ticket.getPayload();
};

/**
 * Tìm hoặc tạo user từ Google payload
 * @returns { user, isNew }
 */
const findOrCreateGoogleUser = async (payload) => {
  const { sub: google_id, email, name, picture } = payload;

  // 1. Tìm theo google_id (đã từng đăng nhập Google)
  let user = await User.findOne({ google_id });
  if (user) return { user, isNew: false };

  // 2. Tìm theo email (có thể đã đăng ký local trước)
  user = await User.findOne({ email });
  if (user) {
    if (user.auth_provider === "local") {
      // Email đã được dùng với local account → yêu cầu đăng nhập local
      throw new Error(MESSAGES.AUTH.GOOGLE_EMAIL_CONFLICT);
    }
    return { user, isNew: false };
  }

  // 3. Tạo user mới, auto-generate username từ email
  let username = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
  const taken = await User.findOne({ username });
  if (taken) {
    username = username + Math.floor(Math.random() * 9000 + 1000);
  }

  const newUser = await User.create({
    username,
    email,
    password: null,
    full_name: name,
    avatar_url: picture || "",
    auth_provider: "google",
    google_id,
    status: "pending_approval",
  });

  return { user: newUser, isNew: true };
};

module.exports = { verifyGoogleToken, findOrCreateGoogleUser };
