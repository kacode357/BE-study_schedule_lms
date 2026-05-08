const authService = require('../services/authService');
const AuthValidation = require('../validations/authValidation');
const AuthResponse = require('../responses/authResponse');
const ApiResponse = require('../responses/apiResponse');

class AuthController {
  async login(req, res) {
    try {
      // 1. Validate Request
      const validationErrors = AuthValidation.validateLogin(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json(ApiResponse.errorMulti(validationErrors));
      }

      // 2. Process Business Logic
      const { email, password } = req.body;
      const { token, user } = await authService.login(email, password);
      
      // 3. Format Response & Return
      const formattedData = AuthResponse.formatLogin(token, user);
      res.status(200).json(ApiResponse.success(formattedData));

    } catch (error) {
      // Logic failures (e.g. Incorrect password)
      res.status(400).json(ApiResponse.errorSingle(error.message));
    }
  }

  async register(req, res) {
    try {
      // 1. Validate Request
      const validationErrors = AuthValidation.validateRegister(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json(ApiResponse.errorMulti(validationErrors));
      }

      // 2. Process Business Logic
      const rawUser = await authService.register(req.body);
      
      // 3. Format Response & Return
      const formattedData = AuthResponse.formatRegister(rawUser);
      res.status(201).json(ApiResponse.success(formattedData));

    } catch (error) {
      res.status(400).json(ApiResponse.errorSingle(error.message));
    }
  }
  async getMyProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await authService.getMyProfile(userId);
      const formattedData = AuthResponse.formatProfile(user);
      res.status(200).json(ApiResponse.success(formattedData));
    } catch (error) {
      res.status(404).json(ApiResponse.errorSingle(error.message));
    }
  }
}

module.exports = new AuthController();
