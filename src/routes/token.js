const route = require("express").Router();
const jwt = require("jsonwebtoken");
const adminAuth = require("../authentication/adminAuth");

const User = require("../db/models/user_model");
const Token = require("../db/models/token_model");
const Admin = require("../db/models/admin_model");

require("dotenv").config();

route.post("/create", adminAuth, async (req, res) => {
  const user_token = new Token({
    creatorID: req.locals.staff_id,
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

route.post("/faculty/claim", async (req, res) => {
  const token = req.header("Authorization");
  const { _id } = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const claimer = await User.findOne({ _id: _id, permitted: false });
    if (!claimer) return res.status(400).send({ message: "user not found" });

    const user_token = await Token.findOne({
      token: req.body.token,
      claimed: false,
    });
    if (!user_token)
      return res.status(400).send({ message: "token not found" });

    claimer.permitted = true;
    user_token.claimed = true;
    user_token.claimerID = claimer.staff_id;

    await user_token.save();
    await claimer.save();

    return res.send({ message: "token claimed" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/admin/claim", async (req, res) => {
  const token = req.header("Authorization");
  const { _id } = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const claimer = await Admin.findOne({ _id: _id, permitted: false });
    if (!claimer) return res.status(400).send({ message: "user not found" });

    const admin_token = await Token.findOne({
      token: req.body.token,
      claimed: false,
    });
    if (!admin_token)
      return res.status(400).send({ message: "token not found" });

    claimer.permitted = true;
    admin_token.claimed = true;
    admin_token.claimerID = claimer.staff_id;

    await admin_token.save();
    await claimer.save();

    return res.send({ message: "token claimed" });
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
