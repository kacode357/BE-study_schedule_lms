const authService = require("../services/authService");
const { verifyGoogleToken, findOrCreateGoogleUser } = require("../services/googleAuthService");
const AuthValidation = require("../validations/authValidation");
const AuthResponse = require("../responses/authResponse");
const ApiResponse = require("../responses/apiResponse");
const MESSAGES = require("../constants/messages");
const jwt = require("jsonwebtoken");

const generateJWT = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

class AuthController {
  // POST /auth/login
  async login(req, res) {
    try {
      const validationErrors = AuthValidation.validateLogin(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json(ApiResponse.errorMulti(validationErrors));
      }
      const { email, password } = req.body;
      const { token, user } = await authService.login(email, password);
      res.status(200).json(ApiResponse.success(AuthResponse.formatLogin(token, user)));
    } catch (error) {
      res.status(400).json(ApiResponse.errorSingle(error.message));
    }
  }

  // POST /auth/register
  async register(req, res) {
    try {
      const validationErrors = AuthValidation.validateRegister(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json(ApiResponse.errorMulti(validationErrors));
      }
      const rawUser = await authService.register(req.body);
      res
        .status(201)
        .json(ApiResponse.success(AuthResponse.formatRegister(rawUser), MESSAGES.AUTH.REGISTER_PENDING));
    } catch (error) {
      res.status(400).json(ApiResponse.errorSingle(error.message));
    }
  }

  // POST /auth/google
  async googleLogin(req, res) {
    try {
      const { id_token } = req.body;
      if (!id_token) {
        return res.status(400).json(ApiResponse.errorSingle(MESSAGES.AUTH.GOOGLE_TOKEN_REQUIRED));
      }

      // Xác minh token từ Google
      const payload = await verifyGoogleToken(id_token);

      // Tìm hoặc tạo user
      const { user, isNew } = await findOrCreateGoogleUser(payload);

      // User mới → chờ admin duyệt
      if (isNew) {
        return res
          .status(201)
          .json(ApiResponse.success(AuthResponse.formatRegister(user), MESSAGES.AUTH.REGISTER_PENDING));
      }

      // Kiểm tra trạng thái tài khoản cũ
      if (user.status === "pending_approval") {
        return res.status(403).json(ApiResponse.errorSingle(MESSAGES.AUTH.ACCOUNT_PENDING_APPROVAL));
      }
      if (user.status === "pending_email_verification") {
        return res.status(403).json(ApiResponse.errorSingle(MESSAGES.AUTH.ACCOUNT_PENDING_EMAIL));
      }
      if (user.status === "rejected") {
        return res.status(403).json(ApiResponse.errorSingle(MESSAGES.AUTH.ACCOUNT_REJECTED));
      }

      // Active → trả về JWT
      const token = generateJWT(user);
      res.status(200).json(ApiResponse.success(AuthResponse.formatLogin(token, user)));
    } catch (error) {
      res.status(400).json(ApiResponse.errorSingle(error.message));
    }
  }

  // GET /auth/verify-email?token=xxx
  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json(ApiResponse.errorSingle(MESSAGES.AUTH.VERIFY_TOKEN_INVALID));
      }
      await authService.verifyEmail(token);
      res.status(200).json(ApiResponse.success(null, MESSAGES.AUTH.EMAIL_VERIFIED));
    } catch (error) {
      res.status(400).json(ApiResponse.errorSingle(error.message));
    }
  }

  // GET /auth/me
  async getMyProfile(req, res) {
    try {
      const user = await authService.getMyProfile(req.user.id);
      res.status(200).json(ApiResponse.success(AuthResponse.formatProfile(user)));
    } catch (error) {
      res.status(404).json(ApiResponse.errorSingle(error.message));
    }
  }
}

module.exports = new AuthController();
