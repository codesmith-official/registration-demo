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

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body, req.user);

    return sendResponse(
      res,
      req.lang,
      'USER.CREATED',
      {
        id: user.id,
        email: user.email,
        name: user.name,
        user_type_id: user.user_type_id,
      },
      StatusCodes.CREATED,
    );
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(
      { ...req.body, id: req.params.id },
      req.user,
    );

    if (!user) {
      return sendError(
        res,
        req.lang,
        'COMMON.NOT_FOUND',
        StatusCodes.NOT_FOUND,
      );
    }

    return sendResponse(
      res,
      req.lang,
      'USER.UPDATED',
      {
        id: user.id,
        email: user.email,
        name: user.name,
        user_type_id: user.user_type_id,
      },
      StatusCodes.OK,
    );
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.findAll(req.user);

    return sendResponse(res, req.lang, 'COMMON.SUCCESS', users, StatusCodes.OK);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  getMe,
  getUser,
  createUser,
  updateUser,
  getAllUsers,
};
