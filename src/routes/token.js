const route = require("express").Router();
const path = require("path");
const pug = require("pug");
const nodemailder = require("nodemailer");
const jwt = require("jsonwebtoken");
const adminAuth = require("../authentication/adminAuth");

const User = require("../db/models/user_model");
const Token = require("../db/models/token_model");
const Admin = require("../db/models/admin_model");

const generateEmail = require("../functions/generateEmail");
const generateToken = require("../functions/generateToken");

require("dotenv").config();

route.post("/faculty/send", async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const claimer = await User.findOne({ _id: _id, permitted: false });
    if (!claimer) return res.status(400).send({ message: "user not found" });

    const token_found = await Token.findOne({
      claimer_staff_id: claimer.staff_id,
      claimed: false,
    });

    const new_token = await generateToken(token_found, claimer.staff_id);

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/request_permission.pug"),
      {
        form: {
          link: `https://lnusr.herokuapp.com/faculty/login`,
          user: claimer.name,
          token: new_token,
        },
      }
    );

    const mail = await nodemailer.createTransport(generateEmail.transport);
    await mail.sendMail(
      generateEmail.options(
        claimer.email,
        "LnuSR sent you a account permission code",
        html
      )
    );
    return res.send({ message: "new token was sent to your email" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/admin/send", async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const claimer = await Admin.findOne({ _id: _id, permitted: false });
    if (!claimer) return res.status(400).send({ message: "user not found" });

    const token_found = await Token.findOne({
      claimer_staff_id: claimer.staff_id,
      claimed: false,
    });

    const new_token = await generateToken(token_found, claimer.staff_id);

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/request_permission.pug"),
      {
        form: {
          link: `https://lnusr.herokuapp.com/admin/login`,
          user: claimer.name,
          token: new_token,
        },
      }
    );

    const mail = await nodemailer.createTransport(generateEmail.transport);
    await mail.sendMail(
      generateEmail.options(
        claimer.email,
        "LnuSR sent you a account permission code",
        html
      )
    );
    return res.send({ message: "new token was sent to your email" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/faculty/claim", async (req, res) => {
  try {
    const token = req.header("Authorization");
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const claimer = await User.findOne({ _id: _id, permitted: false });
    if (!claimer) return res.status(400).send({ message: "user not found" });

    const user_token = await Token.findOne({
      token: req.body.token,
      claimer_staff_id: claimer.staff_id,
      claimed: false,
    });
    if (!user_token)
      return res.status(400).send({ message: "token not found" });

    claimer.permitted = true;
    user_token.claimed = true;

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
  try {
    const token = req.header("Authorization");
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const claimer = await Admin.findOne({ _id: _id, permitted: false });
    if (!claimer) return res.status(400).send({ message: "user not found" });

    const admin_token = await Token.findOne({
      token: req.body.token,
      claimer_staff_id: claimer.staff_id,
      claimed: false,
    });
    if (!admin_token)
      return res.status(400).send({ message: "token not found" });

    claimer.permitted = true;
    admin_token.claimed = true;

    await admin_token.save();
    await claimer.save();

    return res.send({ message: "token claimed" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

module.exports = route;
