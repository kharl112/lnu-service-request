const Request = require("../../../db/models/request_model");
const requestQuery = require("../../../functions/requestQuery");
const pusher = require("../../../functions/pusher");

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

      //trigger notification to user requestor
      pusher.trigger(request_service.user.staff_id, "signed", {
        request_id: req.body._id,
        initiator: req.locals.name,
        user_type: "user",
        message: "Signed and approved your request",
        date: new Date(),
      });

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
        "reports.status": { $ne: "created" },
      })
    );
    return res.send(service_provider_signed);
  };

  return { pendings, signed };
})();

module.exports = { Mutations, Views };
