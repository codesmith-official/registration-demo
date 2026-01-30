const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { sendError } = require('../common/responses/response.helper');
const jwtConfig = require('../config/jwt');
const userService = require('../modules/user/services/user.service');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(
        res,
        req.lang,
        'AUTH.UNAUTHORIZED',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await userService.findById(decoded.id);

    if (!user) {
      return sendError(
        res,
        req.lang,
        'AUTH.UNAUTHORIZED',
        StatusCodes.UNAUTHORIZED,
      );
    }
    req.user = user;
    next();
  } catch (err) {
    return sendError(
      res,
      req.lang,
      'AUTH.UNAUTHORIZED',
      StatusCodes.UNAUTHORIZED,
    );
  }
};

module.exports = authMiddleware;
