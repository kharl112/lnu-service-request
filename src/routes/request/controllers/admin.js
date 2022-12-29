const Request = require("../../../db/models/request_model");
const requestQuery = require("../../../functions/requestQuery");
const pusher = require("../../../functions/pusher");
const createActivityLog = require("../../../functions/createActivityLog");
const createNotification = require("../../../functions/createNotification");
const createMisNotification = require("../../../functions/createMisNotification");

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

  const reject = async (req, res) => {
    const { staff_id } = req.locals;
    const { id, remarks } = req.body;

    try {
      const request = await Request.findOneAndUpdate(
        {
          _id: id,
          "reports.status": "sent",
          "admin.staff_id": staff_id,
          "admin.reports.date": null,
        },
        {
          "reports.status": "rejected",
          "reports.dates.rejected": new Date(),
          "reports.remarks": remarks ? remarks : "",
        }
      );

      if (!request)
        return res.status(404).send({ message: "requested data not found" });

      //create notif default option
      const notif_options = {
        request_id: id,
        initiator: req.locals.name,
      };

      //trigger notification to user requestor
      const user = {
        staff_id: request.user.staff_id,
        user_type: "user",
      };

      //trigger pusher and save notification
      await createNotification({
        user,
        action_type: "rejected",
        ...notif_options,
        description: "Rejected your request",
      });


      //trigger notification for mis
      createMisNotification({
        initiator: req.locals,
        title: "Request rejected by a CAO user",
        description: `${req.locals.name.firstname} rejected a request with an ID of ${request._id}, owned by an staff_id of: ${user.staff_id}`,
      });

      //generate options
      const activity_options = {
        user: {
          staff_id: staff_id,
          user_type: "admin",
        },
        request_id: id,
        description: "rejected a service request",
      };

      //save activity
      const activity = await createActivityLog(activity_options);

      return res.send({ message: "Rejected successfully" });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Something wen't wrong. Please try again." });
    }
  };

  return { sign, reject };
})();

const Views = (() => {
  const all = async (req, res) => {
    const admin_all = await Request.aggregate(
      requestQuery({
        "admin.staff_id": req.locals.staff_id,
        "user.signature": { $ne: null },
      })
    );
    return res.send(admin_all);
  };

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
        $and: [
          { "reports.status": { $ne: "created" } },
          { "reports.status": { $ne: "archived" } },
        ],
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

  return { all, pendings, signed, archives, info };
})();

module.exports = { Mutations, Views };
