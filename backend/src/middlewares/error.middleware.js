const { StatusCodes } = require('http-status-codes');
const { sendError } = require('../common/responses/response.helper');

module.exports = (err, req, res, next) => {
  console.error(err);
  return sendError(
    res,
    req.lang,
    'COMMON.SERVER_ERROR',
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
};
