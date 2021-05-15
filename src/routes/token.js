const route = require("express").Router();
const adminAuth = require("../authentication/adminAuth");
const userAuth = require("../authentication/userAuth");
const User = require("../db/models/user_model");
const Token = require("../db/models/token_model");
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

route.post("/claim", userAuth, async (req, res) => {
  try {
    const user_token = await Token.findOneAndUpdate(
      { token: req.body.token, claimed: false },
      { claimed: true, claimerID: req.locals.staff_id }
    );

    if (!user_token)
      return res.status(400).send({ message: "token not found" });

    const claimer = await User.findOneAndUpdate(
      { staff_id: req.locals.staff_id },
      { permitted: true }
    );

    if (!claimer) return res.status(400).send({ message: "token not found" });

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
