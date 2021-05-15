const Joi = require("joi");

const create = (body) => {
  const schema = Joi.object({
    subject: Joi.string().min(10).max(100).required(),
    greetings: Joi.string().min(10).max(100).required(),
    body: Joi.string().min(10).required(),
    options: Joi.object({}).required(),
    user: Joi.object({
      signature: Joi.string().allow(""),
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

module.exports = { create };
