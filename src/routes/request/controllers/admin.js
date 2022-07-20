const Request = require("../../../db/models/request_model");
const requestQuery = require("../../../functions/requestQuery");
const pusher = require("../../../functions/pusher");
const createActivityLog = require("../../../functions/createActivityLog");

const Mutations = (() => {
  const sign = async (req, res) => {
    try {
      const request_service = await Request.findOneAndUpdate(
        {
          _id: req.body._id,
          "reports.status": "sent",
          "admin.staff_id": req.locals.staff_id,
        },
        {
          "admin.signature": req.body.signature,
          "admin.reports": {
            remarks: req.body.remarks,
            date: new Date(),
          },
        }
      );

      //trigger notification to service provider
      if (request_service.service_provider.staff_id) {
        pusher.trigger(request_service.service_provider.staff_id, "received", {
          request_id: req.body._id,
          initiator: req.locals.name,
          user_type: "provider",
          message: "Approved a request that was sent for you",
          date: new Date(),
        });
      }

      //trigger notification to user requestor
      pusher.trigger(request_service.user.staff_id, "signed", {
        request_id: req.body._id,
        initiator: req.locals.name,
        user_type: "user",
        message: "Signed and approved your request",
        date: new Date(),
      });

      //generate options
      const activity_options = {
        user: {
          staff_id: req.locals.staff_id,
          user_type: "admin",
        },
        request_id: req.body._id,
        description: "signed a service request",
      };

      //save activity
      const activity = await createActivityLog(activity_options);

      return res.send({ message: "signing complete" });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong, please try again." });
    }
  };

  return { sign };
})();

const Views = (() => {
  const pendings = async (req, res) => {
    const admin_pending = await Request.aggregate(
      requestQuery({
        "admin.staff_id": req.locals.staff_id,
        "user.signature": { $ne: null },
        "admin.signature": null,
        "reports.status": "sent",
      })
    );
    return res.send(admin_pending);
  };

  const signed = async (req, res) => {
    const admin_signed = await Request.aggregate(
      requestQuery({
        "admin.staff_id": req.locals.staff_id,
        "user.signature": { $ne: null },
        "admin.signature": { $ne: null },
        "reports.status": "sent",
      })
    );
    return res.send(admin_signed);
  };

  const archives = async (req, res) => {
    const admin_archives = await Request.aggregate(
      requestQuery({
        "admin.staff_id": req.locals.staff_id,
        "reports.status": "archived",
      })
    );

    return res.send(admin_archives);
  };

  const info = async (req, res) => {
    const { _id } = req.params;
    try {
      const form = await Request.findOne({
        _id,
        "admin.staff_id": req.locals.staff_id,
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

  return { pendings, signed, archives, info };
})();

module.exports = { Mutations, Views };
