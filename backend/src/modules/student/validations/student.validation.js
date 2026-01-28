const Joi = require('joi');

module.exports = {
  createOrUpdate: {
    body: Joi.object({
      id: Joi.number().optional(),
      first_name: Joi.string().when('id', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
      last_name: Joi.string().when('id', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
      gender: Joi.string().valid('male', 'female', 'other').when('id', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
      standard_id: Joi.number().when('id', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
      email: Joi.string().email().when('id', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
      password: Joi.string().when('id', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
      contact_number: Joi.string().when('id', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
      bio: Joi.string().allow(null, ''),
    }),
  },
  idParam: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
};
