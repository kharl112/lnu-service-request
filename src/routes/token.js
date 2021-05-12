const route = require("express").Router();
const jwt = require("jsonwebtoken");
const adminAuth = require("../authentication/adminAuth");
const Token = require("../db/models/token_model");
require("dotenv").config();

route.post("/create", adminAuth, async (req, res) => {
  const token = req.header("Authorization");
  const { _id } = jwt.verify(token, process.env.JWT_SECRET);

  const user_token = new Token({
    creatorID: _id,
    claimerID: "",
    claimed: false,
    token: Math.random().toString(36).substring(4),
  });

  try {
    await user_token.save();
    return res.send({ message: "token created" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.get("/all", adminAuth, async (req, res) => {
  const users_token = await Token.find({}).select({ creatorID: 0 });
  return res.send(users_token);
});

route.get("/claimed", adminAuth, async (req, res) => {
  const users_token = await Token.find({ claimed: true }).select({
    creatorID: 0,
  });
  return res.send(users_token);
});

route.get("/unclaimed", adminAuth, async (req, res) => {
  const users_token = await Token.find({ claimed: false }).select({
    creatorID: 0,
  });
  return res.send(users_token);
});

module.exports = route;
