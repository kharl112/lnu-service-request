const Joi = require("joi");

const create = (body) => {
  const schema = Joi.object({
    subject: Joi.string().min(10).max(100).required(),
    hideSignatures: Joi.bool(),
    service_id: Joi.string().min(24).max(24).required(),
    body: Joi.string().min(10).required(),
    admin: Joi.object({
      staff_id: Joi.string().required().allow(null),
    }).required(),
    service_provider: Joi.object({
      staff_id: Joi.string().required().allow(null),
    }).required(),
    user: Joi.object({
      signature: Joi.string().allow(null),
    }).required(),
    options: Joi.object().required(),
    reports: Joi.object({
      status: Joi.string()
        .min(3)
        .max(10)
        .required()
        .valid(...["created", "sent", "completed", "archived"]),
    }).required(),
  });
  return schema.validate(body);
};

const edit = (body) => {
  const schema = Joi.object({
    subject: Joi.string().min(10).max(100).required(),
    service_id: Joi.string().min(24).max(24).required(),
    body: Joi.string().min(10).required(),
    admin: Joi.object({
      staff_id: Joi.string().required(),
      signature: Joi.string().required().allow(null),
    }).required(),
    service_provider: Joi.object({
      staff_id: Joi.string().required().allow(null),
      signature: Joi.string().required().allow(null),
    }).required(),
    user: Joi.object({
      staff_id: Joi.string().required(),
      signature: Joi.string().required(),
    }).required(),
    options: Joi.object().required(),
    reports: Joi.object({
      status: Joi.string()
        .min(3)
        .max(10)
        .required()
        .valid(...["created", "sent", "completed", "archived"]),
      dates: Joi.object({
        created: Joi.required(),
        sent: Joi.required().allow(null),
        completed: Joi.required().allow(null),
        archived: Joi.required().allow(null),
      }).required(),
    }).required(),
  });
  return schema.validate(body);
};
const deleteSelected = (body) => {
  const schema = Joi.object({
    delete_selected: Joi.array().min(1).required(),
  }).required();
  return schema.validate(body);
};

module.exports = { create, edit, deleteSelected };
