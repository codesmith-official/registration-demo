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
      permissions: Joi.array()
        .items(Joi.number())
        .when('id', {
          is: Joi.exist(),
          then: Joi.optional(),
          otherwise: Joi.optional().default([]),
        }),
      status: Joi.boolean().when('id', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.optional().default(true),
      }),
    }),
  },
  idParam: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
};
