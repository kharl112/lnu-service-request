const Joi = require("joi");

const create = (body) => {
  const schema = Joi.object({
    subject: Joi.string().min(10).max(100).required(),
    greetings: Joi.string().min(10).max(100).required(),
    body: Joi.string().min(10).required(),
    options: Joi.object({}).required(),
    user: Joi.object({
      staff_id: Joi.string().required(),
      signed: Joi.boolean().required(),
      signature: Joi.string(),
    }).required(),
    admin: Joi.object({
      staff_id: Joi.string(),
      signed: Joi.boolean().required(),
      signature: Joi.string(),
    }).required(),
    head: Joi.object({
      staff_id: Joi.string(),
      signed: Joi.boolean().required(),
      signature: Joi.string(),
    }).required(),
    save_as: Joi.boolean().require(),
  });
  return schema.validate(body);
};

module.exports = { create };
