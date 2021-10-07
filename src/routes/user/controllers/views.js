const User = require("../../../db/models/user_model");
const { Name, Department } = require("../../../functions/generateProfile");

module.exports = (() => {
  const profile = async (req, res) => {
    const user_profile = await User.aggregate([
      { $match: { staff_id: req.locals.staff_id } },
      {
        $lookup: {
          from: "roles",
          localField: "department.role_id",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $project: {
          _id: 0,
          password: 0,
          __v: 0,
          "unit.__v": 0,
          "role.__v": 0,
        },
      },
    ]);

    const role = user_profile[0].role[0];
    return res.send({ ...user_profile[0], role });
  };

  const all = async (req, res) => {
    const all_users = await User.find({}).select({
      _id: 0,
      password: 0,
      __v: 0,
    });
    return res.send(all_users);
  };

  const permitted = async (req, res) => {
    const permitted_users = await User.find({ permitted: true }).select({
      _id: 0,
      password: 0,
      __v: 0,
    });
    return res.send(permitted_users);
  };

  const pending = async (req, res) => {
    const pending_users = await User.find({ permitted: false }).select({
      _id: 0,
      password: 0,
      __v: 0,
    });
    return res.send(pending_users);
  };

  const all_providers = async (req, res) => {
    const all_service_providers = await User.aggregate([
      { $match: { staff_id: { $ne: req.locals.staff_id }, permitted: true } },
      {
        $lookup: {
          from: "roles",
          localField: "department.role_id",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "department.unit_id",
          foreignField: "_id",
          as: "unit",
        },
      },
      {
        $project: {
          _id: 0,
          password: 0,
          __v: 0,
          department: 0,
          "unit.__v": 0,
          "role.__v": 0,
        },
      },
    ]);

    return res.send(
      all_service_providers.map((node) => ({
        text: `${Name.getFullName(node.name)} (${Department.getFullDepartment({
          unit: node.unit,
          role: node.role,
        })})`,
        staff_id: node.staff_id,
      }))
    );
  };

  return { profile, all, permitted, pending, all_providers };
})();
