const User = require("../db/models/user_model");
const Admin = require("../db/models/admin_model");

module.exports = async (req, res, next) => {
  try {
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

    next();
  } catch (error) {
    return res.status(500).send({
      message: "something wen't wrong while finding users applied in request",
    });
  }
};
