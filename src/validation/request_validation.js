const Joi = require("joi");

const create = (body) => {
  const schema = Joi.object({
    subject: Joi.string().min(10).max(100).required(),
    service_id: Joi.string().min(24).max(24).required(),
    body: Joi.string().min(10).required(),
    options: Joi.object().required().allow({}),
    user: Joi.object({
      signature: Joi.string().required(),
    }).required(),
    admin: Joi.object({
      staff_id: Joi.string().required(),
      signature: Joi.string().allow(""),
    }).required(),
    service_provider: Joi.object({
      staff_id: Joi.string().required().allow(""),
      signature: Joi.string().allow(""),
    }).required(),
    save_as: Joi.number().min(0).max(1).required(),
    status: Joi.number().min(0).max(2).required(),
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
