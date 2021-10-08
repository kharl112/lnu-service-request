const Request = require("../../../db/models/request_model");
const requestQuery = require("../../../functions/requestQuery");

const Views = (() => {
  const track = async (req, res) => {
    try {
      const { _id } = req.params;
      if (!_id) return res.status(500).send({ message: "empty parameter" });

      const [tracked_request] = await Request.aggregate(
        requestQuery({
          _id,
          "user.signature": { $ne: "" },
          save_as: 1,
        })
      );

      const { user, service_provider, admin, service, status } =
        tracked_request;

      if (service_provider.staff_id) {
        service_provider.signature = service_provider.signature ? true : false;
      }

      user.signature = user.signature ? true : false;
      admin.signature = admin.signature ? true : false;

      return res.send({ user, service_provider, admin, service, status });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong, please try again." });
    }
  };

  return { track };
})();

module.exports = { Views };
