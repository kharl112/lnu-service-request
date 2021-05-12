const Joi = require("joi");

const create = (body) => {
  const schema = Joi.object({
    creatorID: Joi.string().min(24).max(24).required(),
    claimerID: Joi.string().min(24).max(24).allow(""),
    claimed: Joi.boolean().required(),
    token: Join.string().min(9).max(9).required(),
  });
  return schema.validate(body);
};
module.exports = { create };
