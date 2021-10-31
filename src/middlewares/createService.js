const Joi = require("joi");
const { Name } = require("../functions/generateProfile");
const Service = require("../db/models/service_model");

module.exports = async (req, res, next) => {
  try {
    if (req.body.other_service) {
      const schema = Joi.string().max(255);
      const { error } = schema.validate(req.body.other_service);
      if (error) return res.status(400).send(error.details[0]);

      req.body.other_service = req.body.other_service
        .split(" ")
        .map((node) => Name.getFixedName(node))
        .join(" ")
        .trim();

      const service_found = await Service.findOne({
        type: req.body.other_service,
      });

      if (service_found) {
        req.body.service_id = service_found._id.toString();
      } else {
        const new_service = new Service({
          type: req.body.other_service,
          component: "Default",
          paper_size: "A4",
          options: { persons_involved: [] },
        });

        const service = await new_service.save();
        req.body.service_id = service._id.toString();
      }

      delete req.body.other_service;
    }
    next();
  } catch (error) {
    return res.status(500).send({
      message: "something wen't wrong while creating custom service",
    });
  }
};
