const Request = require("../../../db/models/request_model");
const requestQuery = require("../../../functions/requestQuery");

const Mutations = (() => {
  const sign = async (req, res) => {
    await Request.findByIdAndUpdate(
      req.body.request_id,
      {
        "admin.signature": req.body.signature,
      },
      {},
      (error) => {
        if (error)
          return res
            .status(500)
            .send({ message: "something went wrong, please try again." });
        return res.send({ message: "signing complete" });
      }
    );
  };

  return { sign };
})();

const Views = (() => {
  const pendings = async (req, res) => {
    const admin_pending = await Request.aggregate(
      requestQuery({
        "admin.staff_id": req.locals.staff_id,
        "user.signature": { $ne: "" },
        "admin.signature": "",
        save_as: 1,
      })
    );
    return res.send(admin_pending);
  };

  const signeds = async (req, res) => {
    const admin_signed = await Request.aggregate(
      requestQuery({
        "admin.staff_id": req.locals.staff_id,
        "user.signature": { $ne: "" },
        "admin.signature": { $ne: "" },
        status: { $ne: 2 },
        save_as: 1,
      })
    );
    return res.send(admin_signed);
  };

  const archiveds = async (req, res) => {
    const admin_archived = await Request.aggregate(
      requestQuery({
        "admin.staff_id": req.locals.staff_id,
        save_as: 1,
        status: 2,
      })
    );

    return res.send(admin_archived);
  };

  const info = async (req, res) => {
    const { id } = req.params;
    try {
      const form = await Request.findOne({
        _id: id,
        "admin.staff_id": req.locals.staff_id,
      }).select({ _id: 0, __v: 0, "user.staff_id": 0, date: 0 });

      return res.send({ form });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong, please try again." });
    }
  };

  return { pendings, signeds, archiveds, info };
})();

module.exports = { Mutations, Views };
