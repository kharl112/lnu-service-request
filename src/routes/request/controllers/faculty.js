const validate = require("../../../validation/request_validation");
const { nanoid } = require("nanoid");

const User = require("../../../db/models/user_model");
const Admin = require("../../../db/models/admin_model");
const Request = require("../../../db/models/request_model");
const requestQuery = require("../../../functions/requestQuery");
const createActivityLog = require("../../../functions/createActivityLog");
const createNotification = require("../../../functions/createNotification");

const Mutations = (() => {
  const create = async (req, res) => {
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

    const _id = nanoid(9);

    const request = new Request({
      _id,
      ...req.body,
      user: { staff_id: req.locals.staff_id, ...req.body.user },
      service_provider: {
        ...req.body.service_provider,
        signature: null,
        reports: { date: null, remarks: null },
      },
      admin: {
        ...req.body.admin,
        signature: null,
        reports: { date: null, remarks: null },
      },
      reports: {
        ...req.body.reports,
        dates: {
          created: new Date(),
          sent: req.body.reports.status === "sent" ? new Date() : null,
          completed: null,
          archived: null,
        },
      },
    });

    try {
      //save request
      await request.save();

      //trigger notification to admin
      if (req.body.reports.status === "sent") {
        //create notif default option
        const notif_options = {
          user: {
            staff_id: req.body.admin.staff_id,
            user_type: "admin",
          },
          action_type: "received",
          request_id: _id,
          initiator: req.locals.name,
          description: "Sent you a service request",
        };

        //trigger pusher and save notification
        await createNotification({
          ...notif_options,
        });
      }

      //generate options
      const activity_options = {
        user: {
          staff_id: req.locals.staff_id,
          user_type: "user",
        },
        request_id: request._id,
        description: "created a new service request",
      };

      //save activity
      const activity = await createActivityLog(activity_options);

      return res.send({
        message: `request ${req.body.reports.status}`,
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

    const { error } = validate.edit(req.body.form);
    if (error) return res.status(400).send(error.details[0]);

    const isSent = req.body.reports.status === "sent";
    delete req.body.reports;

    try {
      const update_request = await Request.findOneAndUpdate(
        { _id, "reports.status": "created" },
        {
          ...req.body,
          service_provider: {
            ...req.body.service_provider,
            signature: null,
            reports: { date: null, remarks: null },
          },
          admin: {
            ...req.body.admin,
            signature: null,
            reports: { date: null, remarks: null },
          },
          "reports.status": isSent ? "sent" : "created",
          "reports.dates.sent": isSent ? new Date() : null,
        }
      );

      //generate options
      const activity_options = {
        user: {
          staff_id: req.locals.staff_id,
          user_type: "user",
        },
        request_id: update_request._id,
        description: "updated a service request",
      };

      //save activity
      const activity = await createActivityLog(activity_options);

      return res.send({ message: "request letter updated" });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong, please try again" });
    }
  };

  const delete_drafts = async (req, res) => {
    const { error } = validate.deleteSelected(req.body);
    if (error) return res.status(400).send(error.details[0]);

    try {
      await Request.deleteMany({
        "user.staff_id": req.locals.staff_id,
        _id: { $in: req.body.delete_selected },
      });

      //generate options
      const activity_options = {
        user: {
          staff_id: req.locals.staff_id,
          user_type: "user",
        },
        request_id: null,
        description: `deleted ${req.body.delete_selected.length} drafted service requests`,
      };

      //save activity
      const activity = await createActivityLog(activity_options);

      return res.send({ message: "selected requests deleted" });
    } catch (error) {
      res
        .status(500)
        .send({ message: "something went wrong, please try again." });
    }
  };

  const send = async (req, res) => {
    const { _id } = req.params;
    if (!_id) return res.status(400).send({ message: "empty parameter" });

    const _request = await Request.findById(_id);
    if (!_request)
      return res.status(404).send({ message: "Requested data not foundI" });

    if (!_request.user.signature)
      return res
        .status(404)
        .send({ message: "You must sign this document before sending out" });

    try {
      const request = await Request.findOneAndUpdate(
        { _id, "reports.status": "created" },
        { "reports.status": "sent", "reports.dates.sent": new Date() }
      );

      //create notif default option
      const notif_options = {
        user: {
          staff_id: request.admin.staff_id,
          user_type: "admin",
        },
        action_type: "received",
        request_id: _id,
        initiator: req.locals.name,
        description: "Sent you a service request",
      };

      //trigger pusher and save notification
      await createNotification({
        ...notif_options,
      });

      //generate options
      const activity_options = {
        user: {
          staff_id: req.locals.staff_id,
          user_type: "user",
        },
        request_id: _id,
        description: "sent a service request",
      };

      //save activity
      const activity = await createActivityLog(activity_options);

      return res.send({ message: "request letter sent" });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong, please try again" });
    }
  };

  const mark_as_completed = async (req, res) => {
    const { _id } = req.params;
    if (!_id) return res.status(400).send({ message: "empty parameter" });

    try {
      const request = await Request.findOneAndUpdate(
        {
          _id,
          "reports.status": "sent",
          "admin.signature": { $ne: null },
          $or: [
            { "service_provider.staff_id": req.locals.staff_id },
            { "user.staff_id": req.locals.staff_id },
          ],
        },
        { "reports.status": "completed", "reports.dates.completed": new Date() }
      );

      //create notif default option
      const notif_options = {
        user: {
          staff_id: request.admin.staff_id,
          user_type: "admin",
        },
        action_type: "received",
        request_id: _id,
        initiator: req.locals.name,
        description: "marked a request as completed",
      };

      //trigger pusher and save notification
      await createNotification({
        ...notif_options,
      });

      //generate options
      const activity_options = {
        user: {
          staff_id: req.locals.staff_id,
          user_type: "user",
        },
        request_id: _id,
        description: "mark a request as completed",
      };

      //save activity
      const activity = await createActivityLog(activity_options);

      return res.send({ message: "request letter marked as completed" });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong, please try again" });
    }
  };

  const mark_as_archived = async (req, res) => {
    const { _id } = req.params;
    if (!_id) return res.status(400).send({ message: "empty parameter" });

    try {
      await Request.findOneAndUpdate(
        {
          _id,
          "reports.status": "completed",
        },
        { "reports.status": "archived", "reports.dates.archived": new Date() }
      );

      //generate options
      const activity_options = {
        user: {
          staff_id: req.locals.staff_id,
          user_type: "user",
        },
        request_id: _id,
        description: "mark a service request as archived",
      };

      //save activity
      const activity = await createActivityLog(activity_options);

      return res.send({ message: "request letter marked as archived" });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong, please try again" });
    }
  };

  return {
    create,
    update,
    delete_drafts,
    send,
    mark_as_completed,
    mark_as_archived,
  };
})();

const Views = (() => {
  const drafts = async (req, res) => {
    const faculty_drafts = await Request.aggregate(
      requestQuery({
        "user.staff_id": req.locals.staff_id,
        "reports.status": "created",
      })
    );
    return res.send(faculty_drafts);
  };

  const sent = async (req, res) => {
    const faculty_sent = await Request.aggregate(
      requestQuery({
        "user.staff_id": req.locals.staff_id,
        "reports.status": { $ne: "created" },
        "reports.status": { $ne: "archived" },
      })
    );
    return res.send(faculty_sent);
  };

  const pendings = async (req, res) => {
    const faculty_pendings = await Request.aggregate(
      requestQuery({
        "user.staff_id": req.locals.staff_id,
        "reports.status": "sent",
      })
    );
    return res.send(faculty_pendings);
  };

  const completed = async (req, res) => {
    const faculty_completed = await Request.aggregate(
      requestQuery({
        "user.staff_id": req.locals.staff_id,
        "reports.status": "completed",
      })
    );
    return res.send(faculty_completed);
  };

  const archives = async (req, res) => {
    const faculty_archives = await Request.aggregate(
      requestQuery({
        "user.staff_id": req.locals.staff_id,
        "reports.status": "archived",
      })
    );
    return res.send(faculty_archives);
  };

  const info = async (req, res) => {
    const { _id } = req.params;
    try {
      const form = await Request.findOne({
        _id,
        $or: [
          { "user.staff_id": req.locals.staff_id },
          { "service_provider.staff_id": req.locals.staff_id },
        ],
      }).select({
        _id: 0,
        __v: 0,
        "admin.reports": 0,
        "service_provider.reports": 0,
      });

      return res.send(form);
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong, please try again." });
    }
  };

  return { drafts, sent, pendings, completed, archives, info };
})();

module.exports = { Mutations, Views };
