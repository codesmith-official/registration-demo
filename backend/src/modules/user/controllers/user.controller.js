const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const userService = require('../services/user.service');
const jwtConfig = require('../../../config/jwt');
const {
  sendResponse,
  sendError,
} = require('../../../common/responses/response.helper');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email, 'auth');
    if (!user) {
      return sendError(
        res,
        req.lang,
        'AUTH.INVALID_CREDENTIALS',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const isValid = await userService.comparePassword(password, user.password);
    if (!isValid) {
      return sendError(
        res,
        req.lang,
        'AUTH.INVALID_CREDENTIALS',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn },
    );

    return sendResponse(res, req.lang, 'AUTH.LOGIN_SUCCESS', {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await userService.findByEmail(email);

    if (existingUser) {
      return sendError(
        res,
        req.lang,
        'AUTH.USER_ALREADY_EXISTS',
        StatusCodes.CONFLICT,
      );
    }

    const user = await userService.createUser({
      email,
      password,
      name,
      role,
    });

    return sendResponse(res, req.lang, 'AUTH.REGISTER_SUCCESS', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const getUser = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);

    if (!user) {
      return sendError(
        res,
        req.lang,
        'COMMON.NOT_FOUND',
        StatusCodes.NOT_FOUND,
      );
    }

    return sendResponse(res, req.lang, 'COMMON.SUCCESS', user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  register,
  getMe,
  getUser,
};
