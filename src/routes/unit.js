const route = require("express").Router();
const userAuth = require("../authentication/userAuth");
const Unit = require("../db/models/unit_model");

route.get("/all", userAuth, async (req, res) => {
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
