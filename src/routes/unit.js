const route = require("express").Router();
const Unit = require("../db/models/unit_model");

route.get("/all", async (req, res) => {
  try {
    const all_units = await Unit.find({});
    return res.send(all_units);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong please try again" });
  }
});

module.exports = route;
