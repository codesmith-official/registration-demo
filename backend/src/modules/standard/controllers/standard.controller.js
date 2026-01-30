const { StatusCodes } = require('http-status-codes');
const {
  sendResponse,
  sendError,
} = require('../../../common/responses/response.helper');
const standardService = require('../services/standard.service');

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
    const page = +req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const data = await standardService.getAll(req.user, { page, limit });
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
