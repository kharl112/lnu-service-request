const route = require("express").Router();
const Role = require("../db/models/role_model");

route.get("/all", async (req, res) => {
  try {
    const all_roles = await Role.find({});
    return res.send(all_roles);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong please try again" });
  }
});

module.exports = route;
