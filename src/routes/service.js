const route = require("express").Router();
const Service = require("../db/models/service_model");

route.get("/all", async (req, res) => {
  try {
    const all_services = await Service.find({});
    return res.send(all_services);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong please try again" });
  }
});

module.exports = route;
