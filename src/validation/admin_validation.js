const Joi = require("joi");
const validString = Joi.string().required();

const create = (body) => {
  const schema = Joi.object({
    staff_id: validString.min(11).max(11),
    name: validString.max(255),
    email: validString.email().max(255),
    password: validString.min(8).max(255),
  });
  return schema.validate(body);
};

module.exports = { create };
