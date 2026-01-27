const { StatusCodes } = require('http-status-codes');
const subjectService = require('../services/subject.service');
const {
  sendResponse,
  sendError,
} = require('../../../common/responses/response.helper');

const createOrUpdate = async (req, res, next) => {
  try {
    const result = await subjectService.createOrUpdate(req.body);

    if (!result) {
      return sendError(
        res,
        req.lang,
        'COMMON.NOT_FOUND',
        StatusCodes.NOT_FOUND,
      );
    }

    const key = req.body.id ? 'SUBJECT.UPDATED' : 'SUBJECT.CREATED';
    return sendResponse(res, req.lang, key, result);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await subjectService.getAll();
    return sendResponse(res, req.lang, 'COMMON.SUCCESS', data);
  } catch (err) {
    next(err);
  }
};

const info = async (req, res, next) => {
  try {
    const data = await subjectService.getById(req.params.id);

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
    const deleted = await subjectService.remove(req.params.id);

    if (!deleted) {
      return sendError(
        res,
        req.lang,
        'COMMON.NOT_FOUND',
        StatusCodes.NOT_FOUND,
      );
    }

    return sendResponse(res, req.lang, 'SUBJECT.DELETED');
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
