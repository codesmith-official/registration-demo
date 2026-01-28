const Joi = require('joi');

module.exports = {
  login: {
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  createUser: {
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      user_type_id: Joi.number().required(),
      permissions: Joi.array().items(Joi.number()).optional().default([]),
      status: Joi.boolean().optional().default(true),
    }),
  },
  updateUser: {
    body: Joi.object({
      id: Joi.number().required(),
      name: Joi.string().optional(),
      user_type_id: Joi.number().optional(),
      permissions: Joi.array().items(Joi.number()).optional().default([]),
      status: Joi.boolean().optional().default(true),
    }),
  },
  idParam: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
  assignStandardsToUser: {
    body: Joi.object({
      userId: Joi.number().integer().required(),
      standardIds: Joi.array().items(Joi.number().integer()).min(1).required(),
    }),
  },
};
