const { StatusCodes } = require('http-status-codes');
const service = require('../services/userType.service');
const {
  sendResponse,
  sendError,
} = require('../../../common/responses/response.helper');

const createOrUpdate = async (req, res, next) => {
  try {
    const result = await service.createOrUpdate(req.body);
    if (!result)
      return sendError(
        res,
        req.lang,
        'COMMON.NOT_FOUND',
        StatusCodes.NOT_FOUND,
      );

    return sendResponse(
      res,
      req.lang,
      req.body.id ? 'USERTYPE.UPDATED' : 'USERTYPE.CREATED',
      result,
    );
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await service.getAll();
    return sendResponse(res, req.lang, 'COMMON.SUCCESS', data);
  } catch (err) {
    next(err);
  }
};

const info = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    if (!data)
      return sendError(
        res,
        req.lang,
        'COMMON.NOT_FOUND',
        StatusCodes.NOT_FOUND,
      );

    return sendResponse(res, req.lang, 'COMMON.SUCCESS', data);
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const done = await service.remove(req.params.id);
    if (!done)
      return sendError(
        res,
        req.lang,
        'COMMON.NOT_FOUND',
        StatusCodes.NOT_FOUND,
      );

    return sendResponse(res, req.lang, 'USERTYPE.DELETED');
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createOrUpdate,
  list,
  info,
  remove,
};
