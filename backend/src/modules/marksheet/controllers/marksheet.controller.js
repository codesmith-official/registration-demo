const service = require('../services/marksheet.service');
const { sendResponse } = require('../../../common/responses/response.helper');

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

module.exports = { createOrUpdate, getByStudent };
