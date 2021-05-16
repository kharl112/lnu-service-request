const Joi = require("joi");

const create = (body) => {
  const schema = Joi.object({
    subject: Joi.string().min(10).max(100).required(),
    greetings: Joi.string().min(10).max(100).required(),
    body: Joi.string().min(10).required(),
    options: Joi.object({
      format: Joi.string().allow(""),
      border: Joi.object({
        top: Joi.string().default("1in"),
        right: Joi.string().default("1in"),
        bottom: Joi.string().default("1in"),
        left: Joi.string().default("1in"),
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
