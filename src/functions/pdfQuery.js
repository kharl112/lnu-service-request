const pdfQuery = (request_id, recipient_prop, recipient_id) => [
  {
    $match: {
      _id: request_id,
      [recipient_prop]: recipient_id,
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
      from: "users",
      localField: "head.staff_id",
      foreignField: "staff_id",
      as: "head.profile",
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
      "admin.profile.password": 0,
      "head.profile.password": 0,
      "admin.profile._id": 0,
      "head.profile._id": 0,
      "admin.profile.email": 0,
      "head.profile.email": 0,
      "admin.profile.permitted": 0,
      "head.profile.permitted": 0,
      "admin.profile.__v": 0,
      "head.profile.__v": 0,
    },
  },
];

module.exports = pdfQuery;
