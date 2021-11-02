const requestQuery = (match) => [
  {
    $match: match,
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
      localField: "service_provider.staff_id",
      foreignField: "staff_id",
      as: "service_provider.profile",
    },
  },
  {
    $lookup: {
      from: "units",
      localField: "service_provider.profile.department.unit_id",
      foreignField: "_id",
      as: "service_provider.department.unit",
    },
  },
  {
    $lookup: {
      from: "roles",
      localField: "service_provider.profile.department.role_id",
      foreignField: "_id",
      as: "service_provider.department.role",
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
    $sort: {
      date: -1,
      "reports.status": 1,
      subject: 1,
    },
  },
  {
    $project: {
      "user.profile.password": 0,
      "admin.profile.password": 0,
      "service_provider.profile.password": 0,
      "admin.profile._id": 0,
      "admin.profile._id": 0,
      "service_provider.profile._id": 0,
      "user.profile.staff_id": 0,
      "user.profile.email": 0,
      "user.profile.department": 0,
      "admin.profile.staff_id": 0,
      "admin.profile.email": 0,
      "service_provider.profile.staff_id": 0,
      "service_provider.profile.email": 0,
      "service_provider.profile.department": 0,
      "user.profile.permitted": 0,
      "admin.profile.permitted": 0,
      "service_provider.profile.permitted": 0,
      "user.profile.__v": 0,
      "admin.profile.__v": 0,
      "service_provider.profile.__v": 0,
      "user.department.role.__v": 0,
      "user.department.unit.__v": 0,
    },
  },
];

module.exports = requestQuery;
