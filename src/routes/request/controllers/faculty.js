const validate = require("../../../validation/request_validation");
const { nanoid } = require("nanoid");
const Joi = require("joi");

const User = require("../../../db/models/user_model");
const Admin = require("../../../db/models/admin_model");
const Request = require("../../../db/models/request_model");
const Service = require("../../../db/models/service_model");
const requestQuery = require("../../../functions/requestQuery");
const { Name } = require("../../../functions/generateProfile");

const Mutations = (() => {
  const create = async (req, res) => {
    req.body.status = 0;

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
        const new_service = new Service({ type: req.body.other_service });
        const service = await new_service.save();

        req.body.service_id = service._id.toString();
      }

      delete req.body.other_service;
    }

    const { error } = validate.create(req.body);
    if (error) return res.status(400).send(error.details[0]);

    const admin_found = await Admin.findOne({
      staff_id: req.body.admin.staff_id,
      permitted: true,
    });
    if (!admin_found)
      return res.status(400).send({ message: "admin not found" });

    if (req.body.service_provider.staff_id) {
      const service_provider_found = await User.findOne({
        staff_id: req.body.service_provider.staff_id,
        permitted: true,
      });
      if (!service_provider_found)
        return res.status(400).send({ message: "service provider not found" });
    }

    const request = new Request({
      _id: nanoid(9),
      ...req.body,
      user: { staff_id: req.locals.staff_id, ...req.body.user },
    });

    try {
      await request.save();
      return res.send({
        message: `request ${
          req.body.save_as === 0 ? "saved as draft" : "sent"
        }`,
      });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong, please try again." });
    }
  };

  const update = async (req, res) => {
    const { _id } = req.params;
    if (!_id) return res.status(400).send({ message: "empty parameter" });

    if (req.body.form.other_service) {
      const schema = Joi.string().max(255);
      const { error } = schema.validate(req.body.form.other_service);
      if (error) return res.status(400).send(error.details[0]);

      req.body.form.other_service = req.body.form.other_service
        .split(" ")
        .map((node) => Name.getFixedName(node))
        .join(" ")
        .trim();

      const service_found = await Service.findOne({
        type: req.body.form.other_service,
      });

      if (service_found) {
        req.body.form.service_id = service_found._id.toString();
      } else {
        const new_service = new Service({ type: req.body.form.other_service });
        const service = await new_service.save();

        req.body.form.service_id = service._id.toString();
      }

      delete req.body.form.other_service;
    }

    const { error } = validate.create(req.body.form);
    if (error) return res.status(400).send(error.details[0]);

    req.body.form.user.staff_id = req.locals.staff_id;

    await Request.findByIdAndUpdate(_id, req.body.form, {}, (error) => {
      if (error)
        return res
          .status(500)
          .send({ message: "something went wrong, please try again" });
      return res.send({ message: "request letter updated" });
    });
  };

  const delete_drafts = async (req, res) => {
    const { error } = validate.deleteSelected(req.body);
    if (error) return res.status(400).send(error.details[0]);

    delete req.body.status;

    await Request.find({
      "user.staff_id": req.locals.staff_id,
      _id: { $in: req.body.selected },
    }).deleteMany({}, (error) => {
      if (error)
        return res
          .status(500)
          .send({ message: "something went wrong, please try again." });
      return res.send({ message: "selected requests deleted" });
    });
  };

  const send = async (req, res) => {
    const { _id } = req.params;
    if (!_id) return res.status(400).send({ message: "empty parameter" });

    await Request.findByIdAndUpdate(_id, { save_as: 1 }, {}, (error) => {
      if (error)
        return res
          .status(500)
          .send({ message: "something went wrong, please try again" });
      return res.send({ message: "request letter sent" });
    });
  };

  const mark_completed = async (req, res) => {
    const { _id } = req.params;
    if (!_id) return res.status(400).send({ message: "empty parameter" });

    await Request.findOneAndUpdate(
      {
        _id: _id,
        $or: [
          { "service_provider.staff_id": req.locals.staff_id },
          { "user.staff_id": req.locals.staff_id },
        ],
      },
      { status: 1 },
      {},
      (error) => {
        if (error)
          return res
            .status(500)
            .send({ message: "something went wrong, please try again" });
        return res.send({ message: "request letter marked as completed" });
      }
    );
  };

  const mark_archived = async (req, res) => {
    const { _id } = req.params;
    if (!_id) return res.status(400).send({ message: "empty parameter" });

    await Request.findOneAndUpdate(
      { _id: _id, "user.staff_id": req.locals.staff_id },
      { status: 2 },
      {},
      (error) => {
        if (error)
          return res
            .status(500)
            .send({ message: "something went wrong, please try again" });
        return res.send({ message: "request letter marked as completed" });
      }
    );
  };

  return { create, update, delete_drafts, send, mark_completed, mark_archived };
})();

const Views = (() => {
  const drafts = async (req, res) => {
    const faculty_drafts = await Request.aggregate(
      requestQuery({
        "user.staff_id": req.locals.staff_id,
        save_as: 0,
      })
    );
    return res.send(faculty_drafts);
  };

  const sents = async (req, res) => {
    const faculty_sent = await Request.aggregate(
      requestQuery({
        "user.staff_id": req.locals.staff_id,
        save_as: 1,
        status: { $ne: 2 },
      })
    );
    return res.send(faculty_sent);
  };

  const pendings = async (req, res) => {
    const faculty_sent = await Request.aggregate(
      requestQuery({
        "user.staff_id": req.locals.staff_id,
        save_as: 1,
        status: 0,
      })
    );
    return res.send(faculty_sent);
  };

  const completeds = async (req, res) => {
    const faculty_sent = await Request.aggregate(
      requestQuery({
        "user.staff_id": req.locals.staff_id,
        save_as: 1,
        status: 1,
      })
    );
    return res.send(faculty_sent);
  };

  const archiveds = async (req, res) => {
    const faculty_sent = await Request.aggregate(
      requestQuery({
        "user.staff_id": req.locals.staff_id,
        save_as: 1,
        status: 2,
      })
    );
    return res.send(faculty_sent);
  };

  const info = async (req, res) => {
    const { id } = req.params;
    try {
      const form = await Request.findOne({
        _id: id,
        "user.staff_id": req.locals.staff_id,
      }).select({ _id: 0, __v: 0, date: 0, "user.staff_id": 0 });

      return res.send({ form });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong, please try again." });
    }
  };

  return { drafts, sents, pendings, completeds, archiveds, info };
})();

module.exports = { Mutations, Views };
