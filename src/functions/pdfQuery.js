const pdfQuery = (request_id, recipient_prop, recipient_id) => [
  {
    $match: {
      _id: request_id,
      [recipient_prop]: recipient_id,
    },
  },
  {
    $lookup: {
      from: "services",
      localField: "service_id",
      foreignField: "_id",
      as: "service",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "user.staff_id",
      foreignField: "staff_id",
      as: "user.profile",
    },
  },
  {
    $lookup: {
      from: "units",
      localField: "user.profile.department.unit_id",
      foreignField: "_id",
      as: "user.department.unit",
    },
  },
  {
    $lookup: {
      from: "roles",
      localField: "user.profile.department.role_id",
      foreignField: "_id",
      as: "user.department.role",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "head.staff_id",
      foreignField: "staff_id",
      as: "head.profile",
    },
  },
  {
    $lookup: {
      from: "units",
      localField: "head.profile.department.unit_id",
      foreignField: "_id",
      as: "head.department.unit",
    },
  },
  {
    $lookup: {
      from: "roles",
      localField: "head.profile.department.role_id",
      foreignField: "_id",
      as: "head.department.role",
    },
  },
  {
    $lookup: {
      from: "admins",
      localField: "admin.staff_id",
      foreignField: "staff_id",
      as: "admin.profile",
    },
  },
  {
    $project: {
      _id: 0,
      save_as: 0,
      "user.profile.password": 0,
      "admin.profile.password": 0,
      "head.profile.password": 0,
      "admin.profile._id": 0,
      "admin.profile._id": 0,
      "head.profile._id": 0,
      "user.profile.email": 0,
      "admin.profile.email": 0,
      "head.profile.email": 0,
      "user.profile.permitted": 0,
      "admin.profile.permitted": 0,
      "head.profile.permitted": 0,
      "user.profile.__v": 0,
      "admin.profile.__v": 0,
      "head.profile.__v": 0,
      "user.department.role.__v": 0,
      "user.department.unit.__v": 0,
    },
  },
];

module.exports = pdfQuery;
