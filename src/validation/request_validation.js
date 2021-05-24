const Joi = require("joi");

const create = (body) => {
  const schema = Joi.object({
    subject: Joi.string().min(10).max(100).required(),
    greetings: Joi.string().min(10).max(100).required(),
    body: Joi.string().min(10).required(),
    options: Joi.object({
      format: Joi.string().allow(""),
      border: Joi.object({
        top: Joi.number().default(0.5).min(0.2).max(4),
        right: Joi.number().default(0.5).min(0.2).max(4),
        bottom: Joi.number().default(0.5).min(0.2).max(4),
        left: Joi.number().default(0.5).min(0.2).max(4),
      })
        .required()
        .allow({}),
    })
      .required()
      .allow({}),
    user: Joi.object({
      signature: Joi.string().required(),
    }).required(),
    admin: Joi.object({
      staff_id: Joi.string().required(),
      signature: Joi.string().allow(""),
    }).required(),
    head: Joi.object({
      staff_id: Joi.string().required().allow(""),
      signature: Joi.string().allow(""),
    }).required(),
    save_as: Joi.number().min(0).max(1).required(),
  });
  return schema.validate(body);
};

const deleteSelected = (body) => {
  const schema = Joi.object({
    selected: Joi.array().min(1).required(),
  }).required();
  return schema.validate(body);
};

module.exports = { create, deleteSelected };
