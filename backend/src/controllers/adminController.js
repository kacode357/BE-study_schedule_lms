const crypto = require("crypto");
const User = require("../models/userModel");
const { sendVerificationEmail, sendRejectionEmail } = require("../services/emailService");
const ApiResponse = require("../responses/apiResponse");
const MESSAGES = require("../constants/messages");

class AdminController {
  // GET /admin/users?status=&role=&page=&limit=
  async getAllUsers(req, res) {
    try {
      const { status, role, page = 1, limit = 20 } = req.query;
      const filter = {};
      if (status) filter.status = status;
      if (role) filter.role = role;

      const users = await User.find(filter)
        .select("-password -email_verify_token -email_verify_expires")
        .sort({ created_at: -1 })
        .skip((page - 1) * parseInt(limit))
        .limit(parseInt(limit));

      const total = await User.countDocuments(filter);

      res.status(200).json(
        ApiResponse.success({ users, total, page: parseInt(page), limit: parseInt(limit) })
      );
    } catch (error) {
      res.status(500).json(ApiResponse.errorSingle(error.message));
    }
  }

  // GET /admin/users/pending
  async getPendingUsers(req, res) {
    try {
      const users = await User.find({ status: "pending_approval" })
        .select("-password -email_verify_token -email_verify_expires")
        .sort({ created_at: 1 }); // FIFO: duyệt theo thứ tự đăng ký

      res.status(200).json(ApiResponse.success(users));
    } catch (error) {
      res.status(500).json(ApiResponse.errorSingle(error.message));
    }
  }

  // POST /admin/users/:id/approve
  async approveUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json(ApiResponse.errorSingle(MESSAGES.ADMIN.USER_NOT_FOUND));
      }
      if (user.status !== "pending_approval") {
        return res.status(400).json(ApiResponse.errorSingle(MESSAGES.ADMIN.INVALID_STATUS_FOR_APPROVE));
      }

      // Tạo token xác thực email
      const token = crypto.randomBytes(32).toString("hex");
      user.status = "pending_email_verification";
      user.email_verify_token = token;
      user.email_verify_expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ
      await user.save();

      // Gửi email xác thực
      await sendVerificationEmail(user.email, user.full_name, token);

      res.status(200).json(ApiResponse.success(null, MESSAGES.ADMIN.APPROVE_SUCCESS));
    } catch (error) {
      res.status(500).json(ApiResponse.errorSingle(error.message));
    }
  }

  // POST /admin/users/:id/reject
  async rejectUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json(ApiResponse.errorSingle(MESSAGES.ADMIN.USER_NOT_FOUND));
      }
      if (user.status !== "pending_approval") {
        return res.status(400).json(ApiResponse.errorSingle(MESSAGES.ADMIN.INVALID_STATUS_FOR_REJECT));
      }

      user.status = "rejected";
      await user.save();

      // Gửi email thông báo từ chối
      await sendRejectionEmail(user.email, user.full_name);

      res.status(200).json(ApiResponse.success(null, MESSAGES.ADMIN.REJECT_SUCCESS));
    } catch (error) {
      res.status(500).json(ApiResponse.errorSingle(error.message));
    }
  }
}

module.exports = new AdminController();
