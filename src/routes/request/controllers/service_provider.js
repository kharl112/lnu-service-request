const Request = require("../../../db/models/request_model");
const requestQuery = require("../../../functions/requestQuery");
const createActivityLog = require("../../../functions/createActivityLog");
const createNotification = require("../../../functions/createNotification");

const Mutations = (() => {
  const sign = async (req, res) => {
    try {
      const request_service = await Request.findOneAndUpdate(
        {
          _id: req.body._id,
          "reports.status": "sent",
          "admin.signature": { $ne: null },
        },
        {
          "service_provider.signature": req.body.signature,
          "service_provider.reports": {
            remarks: req.body.remarks,
            date: new Date(),
          },
        }
      );

      //create notif default option
      const notif_options = {
        user: {
          staff_id: request_service.user.staff_id,
          user_type: "user",
        },
        action_type: "signed",
        request_id: req.body._id,
        initiator: req.locals.name,
        description: "Signed and approved your request",
      };

      //trigger pusher and save notification
      await createNotification({
        ...notif_options,
      });

      //generate options
      const activity_options = {
        user: {
          staff_id: req.locals.staff_id,
          user_type: "service_provider",
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
    const service_provider_pending = await Request.aggregate(
      requestQuery({
        "service_provider.staff_id": req.locals.staff_id,
        "admin.signature": { $ne: null },
        "service_provider.signature": null,
        "reports.status": "sent",
      })
    );
    return res.send(service_provider_pending);
  };

  const signed = async (req, res) => {
    const service_provider_signed = await Request.aggregate(
      requestQuery({
        "service_provider.staff_id": req.locals.staff_id,
        "admin.signature": { $ne: null },
        "service_provider.signature": { $ne: null },
        $and: [
          { "reports.status": { $ne: "created" } },
          { "reports.status": { $ne: "archived" } },
        ],
      })
    );
    return res.send(service_provider_signed);
  };

  return { pendings, signed };
})();

module.exports = { Mutations, Views };
