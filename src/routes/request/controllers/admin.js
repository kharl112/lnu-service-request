const Request = require("../../../db/models/request_model");
const requestQuery = require("../../../functions/requestQuery");

const Mutations = (() => {
  const sign = async (req, res) => {
    try {
      await Request.findOneAndUpdate(req.body._id, {
        "admin.signature": req.body.signature,
        "admin.reports.status": "sent",
        "admin.reports": {
          ...req.body.reports,
          date: new Date(),
        },
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
    const admin_archived = await Request.aggregate(
      requestQuery({
        "admin.staff_id": req.locals.staff_id,
        "reports.status": "archived",
      })
    );

    return res.send(admin_archived);
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
