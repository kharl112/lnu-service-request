const route = require("express").Router();
const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");
const User = require("../db/models/user_model");
const Admin = require("../db/models/admin_model");
const generateEmail = require("../functions/generateEmail");
const { create, login, update } = require("../validation/user_validation");
const { getFixedName } = require("../functions/generateProfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userAuth = require("../authentication/userAuth");
require("dotenv").config();

route.post("/create", async (req, res) => {
  const form = { ...req.body };

  if (typeof form.name.suffixes !== "object")
    form.name.suffixes = form.name.suffixes.split(",");

  const { error } = create(form);
  if (error) return res.status(400).send(error.details[0]);

  form.name.middle_initial = form.name.middle_initial.toUpperCase();
  form.name.firstname = getFixedName(form.name.firstname);
  form.name.lastname = getFixedName(form.name.lastname);

  const user_found = await User.aggregate([
    {
      $match: {
        email: { $in: [form.email] },
        staff_id: { $in: [form.staff_id] },
      },
      $match: {
        staff_id: { $in: [form.staff_id] },
      },
    },
  ]);

  const admin_found = await Admin.aggregate([
    {
      $match: {
        email: { $in: [form.email] },
        staff_id: { $in: [form.staff_id] },
      },
      $match: {
        staff_id: { $in: [form.staff_id] },
      },
    },
  ]);

  if (user_found[0] || admin_found[0])
    return res
      .status(400)
      .send({ message: "the email or ID number you provided already exists" });

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(form.password, salt);

  const user = new User({
    ...form,
    password: hash,
    permitted: false,
  });

  try {
    const new_user = await user.save();
    const token = jwt.sign({ _id: new_user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "we can't process your request, please try again." });
  }
});

route.post("/update", userAuth, async (req, res) => {
  const form = { ...req.body };

  await ["email", "permitted", "password", "staff_id"].map((node) =>
    form[node] ? delete form[node] : null
  );

  if (typeof form.name.suffixes !== "object")
    form.name.suffixes = form.name.suffixes.split(",");

  const { error } = update(form);
  if (error) return res.status(400).send(error.details[0]);

  form.name.middle_initial = form.name.middle_initial.toUpperCase();
  form.name.firstname = getFixedName(form.name.firstname);
  form.name.lastname = getFixedName(form.name.lastname);

  const user_staff_id = await User.findOne({
    staff_id: req.locals.staff_id,
    email: { $ne: req.locals.email },
  });
  if (user_staff_id)
    return res.status(400).send({ message: "ID number already exists" });

  try {
    const updated_user = await User.findOneAndUpdate(
      {
        staff_id: req.locals.staff_id,
      },
      { ...form }
    );

    if (!updated_user)
      return res
        .status(500)
        .send({ message: "we can't process your request, please try again." });

    return res.send({ message: "account successfully updated" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "we can't process your request, please try again." });
  }
});

route.post("/login", async (req, res) => {
  const { error } = login(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user_found = await User.findOne({ email: req.body.email });
  if (!user_found)
    return res.status(400).send({ message: "account not found" });

  const hash = bcrypt.compareSync(req.body.password, user_found.password);
  if (!hash) return res.status(400).send({ message: "invalid password" });

  try {
    const token = jwt.sign({ _id: user_found._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "we can't process your request, please try again." });
  }
});

route.post("/validate/email", async (req, res) => {
  const user_email_found = await User.findOne({ email: req.body.email });
  const admin_email_found = await Admin.findOne({ email: req.body.email });

  if (user_email_found || admin_email_found)
    return res.status(400).send({ message: "this email already exists" });

  return res.send({ email: req.body.email });
});

route.post("/send/email/link", async (req, res) => {
  const email_found = await User.findOne({ email: req.body.email });
  if (!email_found) return res.status(400).send({ message: "email not found" });

  const token = jwt.sign({ _id: email_found._id }, process.env.PASSWORD_RESET, {
    expiresIn: "1h",
  });

  const mail = nodemailer.createTransport(generateEmail.transport);

  try {
    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/reset_password.pug"),
      {
        form: {
          link: `http://localhost:8080/faculty/forgot/password/reset/${token}`,
          firstname: email_found.name.firstname,
        },
      }
    );

    await mail.sendMail(
      generateEmail.options(email_found.email, "LnuSR account retrieval", html.toString())
    );
    return res.send({ message: "email sent" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "we can't process your request, please try again." });
  }
});

route.post("/reset/password/:_id_token", async (req, res) => {
  const { new_password } = req.body;
  const { _id_token } = req.params;

  if (!_id_token) return res.status(500).send({ message: "empty parameter" });

  try {
    const { _id } = jwt.verify(_id_token, process.env.PASSWORD_RESET);

    const user_found = await User.findById(_id);
    if (!user_found)
      return res.status(400).send({ message: "account not found" });

    const same_password = bcrypt.compareSync(new_password, user_found.password);
    if (same_password)
      return res
        .status(400)
        .send({ message: "new password can't be the same as old password" });

    const salt = bcrypt.genSaltSync(10);
    const new_hash = bcrypt.hashSync(new_password, salt);

    user_found.password = new_hash;
    await user_found.save();

    const token = jwt.sign({ _id: user_found._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({ token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "we can't process your request, please try again." });
  }
});

route.post("/change/password", userAuth, async (req, res) => {
  const { old, new_1 } = req.body;

  const user_found = await User.findOne({ staff_id: req.locals.staff_id });
  if (!user_found)
    return res.status(400).send({ message: "account not found" });

  const same_password = bcrypt.compareSync(new_1, user_found.password);
  if (same_password)
    return res
      .status(400)
      .send({ message: "new password can't be the same as old password" });

  const hash = bcrypt.compareSync(old, user_found.password);
  if (!hash) return res.status(400).send({ message: "invalid password" });

  const salt = bcrypt.genSaltSync(10);
  const new_hash = bcrypt.hashSync(new_1, salt);

  try {
    user_found.password = new_hash;
    await user_found.save();
    return res.send({ message: "password changed" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "we can't process your request, please try again." });
  }
});

route.get("/profile", userAuth, async (req, res) => {
  return res.send(req.locals);
});

route.get("/head/all", userAuth, async (req, res) => {
  const all_head = await User.find({
    "department.unit_role": { $in: [2, 3] },
  }).select({
    _id: 0,
    email: 0,
    password: 0,
    signature_url: 0,
    __v: 0,
  });
  return res.send(
    all_head.map((node, index) => ({
      name: `${node.name.prefix}. ${node.name.firstname} ${node.name.middle_initial}. ${node.name.lastname}`,
      staff_id: node.staff_id,
    }))
  );
});

module.exports = route;
