const { sendResponse } = require('../../../common/responses/response.helper');
const service = require('../services/marksheet.service');

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

const createOrUpdate = async (req, res, next) => {
  try {
    const data = await service.createOrUpdate(req.body);
    return sendResponse(res, req.lang, 'MARKSHEET.SAVED', data);
  } catch (e) {
    next(e);
  }
};

const getByStudent = async (req, res, next) => {
  try {
    const data = await service.getByStudent(req.params.student_id);
    return sendResponse(res, req.lang, 'COMMON.SUCCESS', data);
  } catch (e) {
    next(e);
  }
};

module.exports = { list, createOrUpdate, getByStudent };
