const Unit = require("../models/unit_model");
const migrate = async () => {
  const units = [
    {
      _id: "60c33c099d8cb57657647214",
      name: "Info Tech & Computer Education",
    },
    {
      _id: "60c33e72a6421f782f12f4f8",
      name: "Engineering",
    },
    {
      _id: "60c340e73c7e377b943f5406",
      name: "Filipino Education",
    },
    {
      _id: "60c340ee3c7e377b943f5407",
      name: "Tourism Circle",
    },
    {
      _id: "60c48d03aea4dc7a97b8ed00",
      name: "History Department",
    },
    {
      _id: "60c48d42aea4dc7a97b8ed01",
      name: "English And Literature",
    },
    {
      _id: "60c4bb035eeb7e9816a1d6eb",
      name: "Social Sciences",
    },
    {
      _id: "6108accdd292f8002ba2c05f",
      name: "Reproduction Center",
    },
  ];

  await Unit.insertMany(units, { ordered: false });
};

module.exports = { migrate };
