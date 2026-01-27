const service = require('../services/permission.service');
const {
  sendResponse,
  sendError,
} = require('../../../common/responses/response.helper');

const list = async (req, res, next) => {
  try {
    const data = await service.getAll();
    return sendResponse(res, req.lang, 'COMMON.SUCCESS', data);
  } catch (err) {
    next(err);
  }
};

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
      req.body.id ? 'PERMISSION.UPDATED' : 'PERMISSION.CREATED',
      result,
    );
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

    return sendResponse(res, req.lang, 'STUDENT.DELETED');
  } catch (e) {
    next(e);
  }
};

module.exports = {
  list,
  createOrUpdate,
  remove,
};
