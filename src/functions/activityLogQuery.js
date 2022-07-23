const activityLogQuery = (match) => [
  { $match: match },
  {
    $lookup: {
      from: "requests",
      localField: "request_id",
      foreignField: "_id",
      as: "request",
    },
  },
  {
    $unwind: {
      path: "$request",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "services",
      localField: "request.service_id",
      foreignField: "_id",
      as: "request.service",
    },
  },
  {
    $unwind: {
      path: "$request.service",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      "request.user": 0,
      "request.admin": 0,
      "request.service_provider": 0,
      "request.service.options": 0,
      __v: 0,
      "request.__v": 0,
      "request.service.__v": 0,
    },
  },
];

module.exports = activityLogQuery;

