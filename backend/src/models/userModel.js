const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, default: null }, // null cho Google users
  full_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  role: { type: String, enum: ["admin", "teacher", "student"], default: "student" },

  // Trạng thái tài khoản
  status: {
    type: String,
    enum: ["pending_approval", "pending_email_verification", "active", "rejected"],
    default: "pending_approval",
  },

  // Đăng nhập
  auth_provider: { type: String, enum: ["local", "google"], default: "local" },
  google_id: { type: String, default: null },

  // Xác thực email
  email_verify_token: { type: String, default: null },
  email_verify_expires: { type: Date, default: null },

  avatar_url: { type: String, default: "", trim: true },
  created_at: { type: Date, default: Date.now },
});

// Sparse index: google_id unique nhưng cho phép null
userSchema.index({ google_id: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("User", userSchema);
