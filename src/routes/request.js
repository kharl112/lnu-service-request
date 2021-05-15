const route = require("express").Router();
const { create } = require("../validation/request_validation");
const userAuth = require("../authentication/userAuth");

route.post("/create", userAuth, (req, res) => {
  const { error } = create(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  return res.send(req.body);
});

module.exports = route;
