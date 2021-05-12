const route = require("express").Router();
const adminAuth = require("../authentication/adminAuth");
const Token = require("../db/models/token_model");
const { create } = require("../validation/token_validation");

route.post("/create", adminAuth, async (req, res) => {
  const { error } = create(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const token = new Token(req.body);

  try {
    await token.save();
    return res.send({ message: "token created" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

module.exports = route;
