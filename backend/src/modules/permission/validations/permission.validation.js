const Joi = require('joi');

module.exports = {
  createOrUpdate: {
    body: Joi.object({
      id: Joi.number().optional(),
      name: Joi.string().when('id', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
      key: Joi.string().when('id', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
      description: Joi.string().when('id', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
    }),
  },
  idParam: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
};
