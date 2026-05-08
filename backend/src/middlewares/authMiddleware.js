const jwt = require('jsonwebtoken');
const ApiResponse = require('../responses/apiResponse');
const MESSAGES = require('../constants/messages');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(ApiResponse.errorSingle(MESSAGES.AUTH.TOKEN_MISSING));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(ApiResponse.errorSingle(MESSAGES.AUTH.TOKEN_INVALID));
  }
};

const isRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json(ApiResponse.errorSingle(MESSAGES.AUTH.FORBIDDEN));
    }
    next();
  };
};

module.exports = {
  verifyToken,
  isRole
};
