const Request = require("../../../db/models/request_model");
const requestQuery = require("../../../functions/requestQuery");

const Mutations = (() => {
  const sign = async (req, res) => {
    if (req.locals.department.role_id === 1)
      return res.status(401).send({ message: "invalid user type" });

    await Request.findByIdAndUpdate(
      req.body.request_id,
      {
        "service_provider.signature": req.body.signature,
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
    const service_provider_pending = await Request.aggregate(
      requestQuery({
        "service_provider.staff_id": req.locals.staff_id,
        "admin.signature": { $ne: "" },
        "service_provider.signature": "",
        save_as: 1,
      })
    );
    return res.send(service_provider_pending);
  };

  const signeds = async (req, res) => {
    const service_provider_signed = await Request.aggregate(
      requestQuery({
        "service_provider.staff_id": req.locals.staff_id,
        "admin.signature": { $ne: "" },
        "service_provider.signature": { $ne: "" },
        save_as: 1,
      })
    );
    return res.send(service_provider_signed);
  };

  return { pendings, signeds };
})();

module.exports = { Mutations, Views };
