const Role = require("../models/role_model");

const migrate = () => {
  const roles = [
    {
      _id: "60c33c6e9d8cb57657647215",
      name: "President",
      level: 2,
    },
    {
      _id: "60c4838910aa1775ee60a97f",
      name: "Vice president",
      level: 2,
    },
    {
      _id: "60c4846a7268db7625e574ad",
      name: "Auditor",
      level: 2,
    },

    {
      _id: "60c33e3ca6421f782f12f4f7",
      name: "Faculty",
      level: 2,
    },
    {
      _id: "6108ace7d292f8002ba2c06c",
      name: "Reproduction Staff",
      level: 1,
    },
    {
      _id: "60c48df0ca0bdf7b22dca3db",
      name: "Cleaner",
      level: 1,
    },
    {
      _id: "60c485a6a6da4b76bf0d2bb6",
      name: "Janitor",
      level: 1,
    },
  ];

  Role.insertMany(roles, { ordered: false });
};

module.exports = { migrate };
