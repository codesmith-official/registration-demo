const { StatusCodes } = require('http-status-codes');
const standardService = require('../services/standard.service');
const {
  sendResponse,
  sendError,
} = require('../../../common/responses/response.helper');

const createOrUpdate = async (req, res, next) => {
  try {
    const result = await standardService.createOrUpdate(req.body);

    if (!result) {
      return sendError(
        res,
        req.lang,
        'COMMON.NOT_FOUND',
        StatusCodes.NOT_FOUND,
      );
    }

    const key = req.body.id ? 'STANDARD.UPDATED' : 'STANDARD.CREATED';
    return sendResponse(res, req.lang, key, result);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await standardService.getAll(req.user);
    return sendResponse(res, req.lang, 'COMMON.SUCCESS', data);
  } catch (err) {
    next(err);
  }
};

const info = async (req, res, next) => {
  try {
    const data = await standardService.getById(req.params.id);

    if (!data) {
      return sendError(
        res,
        req.lang,
        'COMMON.NOT_FOUND',
        StatusCodes.NOT_FOUND,
      );
    }

    return sendResponse(res, req.lang, 'COMMON.SUCCESS', data);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await standardService.remove(req.params.id);

    if (!deleted) {
      return sendError(
        res,
        req.lang,
        'COMMON.NOT_FOUND',
        StatusCodes.NOT_FOUND,
      );
    }

    return sendResponse(res, req.lang, 'STANDARD.DELETED');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrUpdate,
  list,
  info,
  remove,
};
