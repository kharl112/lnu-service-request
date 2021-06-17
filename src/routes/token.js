const route = require("express").Router();
const path = require("path");
const pug = require("pug");
const nodemailder = require("nodemailer");
const jwt = require("jsonwebtoken");
const adminAuth = require("../authentication/adminAuth");
const userAuth = require("../authentication/userAuth");

const User = require("../db/models/user_model");
const Token = require("../db/models/token_model");
const Admin = require("../db/models/admin_model");

const generateEmail = require("../functions/generateEmail");
const generateToken = require("../functions/generateToken");

require("dotenv").config();

route.post("/faculty/send", userAuth, async (req, res) => {
  try {
    const token = req.body.token;

    if (!token) return res.status(400).send({ message: "token not found" });
    const token_found = await Token.findOne({
      token,
      claimer_staff_id: req.locals.staff_id,
    });

    const new_token = generateToken(token_found, req.locals.staff_id);

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/request_permission.pug"),
      {
        form: {
          link: `https://lnusr.herokuapp.com/faculty/login`,
          user: req.locals.name,
          token: new_token,
        },
      }
    );

    const mail = nodemailer.createTransport(generateEmail.transport);
    await mail.sendMail(
      generateEmail.options(
        req.locals.email,
        "LnuSR sent you a account permission code",
        html
      )
    );
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/admin/send", adminAuth, async (req, res) => {
  try {
    const token = req.body.token;

    if (!token) return res.status(400).send({ message: "token not found" });
    const token_found = await Token.findOne({
      token,
      claimer_staff_id: req.locals.staff_id,
    });

    const new_token = generateToken(token_found, req.locals.staff_id);

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/request_permission.pug"),
      {
        form: {
          link: `https://lnusr.herokuapp.com/admin/login`,
          user: req.locals.name,
          token: new_token,
        },
      }
    );

    const mail = nodemailer.createTransport(generateEmail.transport);
    await mail.sendMail(
      generateEmail.options(
        req.locals.email,
        "LnuSR sent you a account permission code",
        html
      )
    );
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
