const { StatusCodes } = require('http-status-codes');
const {
  sendResponse,
  sendError,
} = require('../../../common/responses/response.helper');
const service = require('../services/student.service');

const createOrUpdate = async (req, res, next) => {
  try {
    const result = await service.createOrUpdate(req.body, req.user);
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
      req.body.id ? 'STUDENT.UPDATED' : 'STUDENT.CREATED',
      result,
    );
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  try {
    const page = +req.query?.page || 1;
    const limit = +req.query?.limit || 10;
    const data = await service.getAll({ page, limit });
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

    return sendResponse(res, req.lang, 'STUDENT.DELETED');
  } catch (e) {
    next(e);
  }
};

const exportStudents = async (req, res, next) => {
  try {
    const file = await service.exportStudents();

    return sendResponse(res, req.lang, 'STUDENT.FILE_GENERATED', {
      download_url: file.filePath,
    });
  } catch (e) {
    next(e);
  }
};

const importStudents = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'STUDENT.EXCEL_FILE_REQUIRED',
      });
    }

    const data = await service.importStudents(req.file.path);
    unlink(req.file.path);
    return sendResponse(res, req.lang, 'STUDENT.IMPORT_COMPLETED', data);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createOrUpdate,
  list,
  info,
  remove,
  exportStudents,
  importStudents,
};
