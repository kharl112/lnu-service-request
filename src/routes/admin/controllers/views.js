const Admin = require("../../../db/models/admin_model");
const { Name } = require("../../../functions/generateProfile");

module.exports = (() => {
  const profile = async (req, res) => {
    return res.send(req.locals);
  };

  const all = async (req, res) => {
    const all_admin = await Admin.find({ permitted: true }).select({
      _id: 0,
      email: 0,
      password: 0,
      signature_url: 0,
      __v: 0,
    });
    return res.send(
      all_admin.map((node, index) => ({
        name: Name.getFullName(node.name),
        staff_id: node.staff_id,
        availability: !!node.availability
      }))
    );
  };

  return { profile, all };
})();
