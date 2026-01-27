const Joi = require('joi');

const createOrUpdate = {
  body: Joi.object({
    id: Joi.number().optional(),
    standard: Joi.string().min(2).max(100).when('id', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    subject_ids: Joi.array().items(Joi.number()).min(1).when('id', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
  }),
};

const idParam = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = {
  createOrUpdate,
  idParam,
};
