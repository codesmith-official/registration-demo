const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const {
  sendResponse,
  sendError,
} = require('../../../common/responses/response.helper');
const jwtConfig = require('../../../config/jwt');
const userService = require('../services/user.service');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const checkUser = await userService.findByEmail(email, 'auth');
    if (!checkUser) {
      return sendError(
        res,
        req.lang,
        'AUTH.INVALID_CREDENTIALS',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const isValid = await userService.comparePassword(
      password,
      checkUser.password,
    );
    if (!isValid) {
      return sendError(
        res,
        req.lang,
        'AUTH.INVALID_CREDENTIALS',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const user = await userService.findById(checkUser.id);
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userType: user.userType.name,
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
        userType: user.userType,
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

const deleteUser = async (req, res, next) => {
  try {
    const done = await userService.deleteUser(req.params.id);
    if (!done)
      return sendError(
        res,
        req.lang,
        'COMMON.NOT_FOUND',
        StatusCodes.NOT_FOUND,
      );

    return sendResponse(res, req.lang, 'USER.DELETED');
  } catch (e) {
    next(e);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const page = +req.query?.page || 1;
    const limit = +req.query?.limit || 10;
    const users = await userService.findAll(req.user, { page, limit });

    return sendResponse(res, req.lang, 'COMMON.SUCCESS', users, StatusCodes.OK);
  } catch (err) {
    next(err);
  }
};

const assignStandardsToUser = async (req, res, next) => {
  try {
    const response = await userService.assignStandardsToUser(
      req.body,
      req.user,
    );

    if (!response.process) {
      return sendError(res, req.lang, response.message, response.statusCode);
    }

    return sendResponse(
      res,
      req.lang,
      'USER.STANDARDS_ASSIGNED',
      response.data,
    );
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
  deleteUser,
  getAllUsers,
  assignStandardsToUser,
};
