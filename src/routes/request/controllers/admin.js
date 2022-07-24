const Request = require("../../../db/models/request_model");
const requestQuery = require("../../../functions/requestQuery");
const pusher = require("../../../functions/pusher");
const createActivityLog = require("../../../functions/createActivityLog");
const createNotification = require("../../../functions/createNotification");

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

      //create notif default option
      const notif_options = {
        request_id: req.body._id,
        initiator: req.locals.name,
      };

      //trigger notification to service provider
      if (request_service.service_provider.staff_id) {
        const provider = {
          staff_id: request_service.service_provider.staff_id,
          user_type: "provider",
        };

        //trigger pusher and save notification
        await createNotification({
          user: provider,
          action_type: "received",
          ...notif_options,
          description: "Approved a request that was sent for you",
        });
      }

      //trigger notification to user requestor
      const user = {
        staff_id: request_service.user.staff_id,
        user_type: "user",
      };

      //trigger pusher and save notification
      await createNotification({
        user,
        action_type: "signed",
        ...notif_options,
        description: "Signed and approved your request",
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
