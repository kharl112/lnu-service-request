const Joi = require("joi");
const validString = Joi.string().required();

const create = (body) => {
  const schema = Joi.object({
    staff_id: validString.min(11).max(11),
    name: Joi.object({
      firstname: validString.min(2).max(255),
      lastname: validString.min(2).max(255),
      middlename: validString.min(2).max(255),
    }),
    email: validString.email().max(255),
    password: validString.min(8).max(255),
  });
  return schema.validate(body);
};

module.exports = { create };