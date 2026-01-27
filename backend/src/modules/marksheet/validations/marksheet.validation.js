const Joi = require('joi');

module.exports = {
  createOrUpdate: {
    body: Joi.object({
      student_id: Joi.number().required(),
      standard_id: Joi.number().required(),
      marks: Joi.array()
        .items(
          Joi.object({
            subject_id: Joi.number().required(),
            mark: Joi.number().min(0).max(100).required(),
          }),
        )
        .min(1)
        .required(),
    }),
  },
  studentParam: {
    params: Joi.object({
      student_id: Joi.number().required(),
    }),
  },
};
