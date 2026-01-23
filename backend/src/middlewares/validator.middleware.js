const { StatusCodes } = require('http-status-codes');

module.exports = (schema) => (req, res, next) => {
  const validationErrors = [];

  if (schema.body) {
    const { error } = schema.body.validate(req.body);
    if (error) validationErrors.push(error.details[0].message);
  }

  if (schema.params) {
    const { error } = schema.params.validate(req.params);
    if (error) validationErrors.push(error.details[0].message);
  }

  if (validationErrors.length) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: validationErrors[0],
    });
  }

  next();
};
