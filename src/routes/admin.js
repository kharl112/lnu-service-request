const route = require("express").Router();
const nodemailer = require("nodemailer");
const Admin = require("../db/models/admin_model");
const User = require("../db/models/user_model");
const generateEmail = require("../functions/generateEmail");
const adminAuth = require("../authentication/adminAuth");
const { create, login, update } = require("../validation/admin_validation");
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

  const admin = new Admin({
    ...req.body,
    password: hash,
    permitted: false,
  });

  try {
    const new_admin = await admin.save();
    const token = jwt.sign({ _id: new_admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/update", adminAuth, async (req, res) => {
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

  const admin_staff_id = await Admin.findOne({
    staff_id: req.locals.staff_id,
    email: { $ne: req.locals.email },
  });
  if (admin_staff_id)
    return res.status(400).send({ message: "staff_id  already exists." });

  try {
    const updated_admin = await Admin.findOneAndUpdate(
      {
        staff_id: req.locals.staff_id,
      },
      { ...form }
    );
    if (!updated_admin)
      return res
        .status(500)
        .send({ message: "we can't process your request, please try again." });

    return res.send({ message: "account successfully updated" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/login", async (req, res) => {
  const { error } = login(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const admin_found = await Admin.findOne({ email: req.body.email });
  if (!admin_found)
    return res.status(400).send({ message: "account not found" });

  const hash = bcrypt.compareSync(req.body.password, admin_found.password);
  if (!hash) return res.status(400).send({ message: "invalid password" });

  try {
    const token = jwt.sign({ _id: admin_found._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "we can't process your request, please try again." });
  }
});

route.post("/send/email/link", async (req, res) => {
  const email_found = await Admin.findOne({ email: req.body.email });
  if (!email_found) return res.status(400).send({ message: "email not found" });

  const token = jwt.sign({ _id: email_found._id }, process.env.PASSWORD_RESET, {
    expiresIn: 300000,
  });

  const mail = nodemailer.createTransport(generateEmail.transport);

  try {
    await mail.sendMail(
      generateEmail.options(email_found.email, "LnuSR account retrieval", token)
    );
    return res.send({ message: "email sent" });
  } catch (error) {
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

    const admin_found = await Admin.findById(_id);
    if (!admin_found)
      return res.status(400).send({ message: "account not found" });

    const same_password = bcrypt.compareSync(
      new_password,
      admin_found.password
    );
    if (same_password)
      return res
        .status(400)
        .send({ message: "new password can't be the same as old password" });

    const salt = bcrypt.genSaltSync(10);
    const new_hash = bcrypt.hashSync(new_password, salt);

    admin_found.password = new_hash;
    await admin_found.save();

    const token = jwt.sign({ _id: admin_found._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({ token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "we can't process your request, please try again." });
  }
});

route.post("/change/password", adminAuth, async (req, res) => {
  const { old, new_1 } = req.body;

  const admin_found = await Admin.findOne({ staff_id: req.locals.staff_id });
  if (!admin_found)
    return res.status(400).send({ message: "account not found" });

  const same_password = bcrypt.compareSync(new_1, admin_found.password);
  if (same_password)
    return res
      .status(400)
      .send({ message: "new password can't be the same as old password" });

  const hash = bcrypt.compareSync(old, admin_found.password);
  if (!hash) return res.status(400).send({ message: "invalid password" });

  const salt = bcrypt.genSaltSync(10);
  const new_hash = bcrypt.hashSync(new_1, salt);

  try {
    admin_found.password = new_hash;
    await admin_found.save();
    return res.send({ message: "password changed" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "we can't process your request, please try again." });
  }
});

route.get("/profile", adminAuth, async (req, res) => {
  return res.send(req.locals);
});

route.get("/all", userAuth, async (req, res) => {
  const all_admin = await Admin.find({ permitted: true }).select({
    _id: 0,
    email: 0,
    password: 0,
    signature_url: 0,
    __v: 0,
  });
  return res.send(
    all_admin.map((node, index) => ({
      name: `${node.name.prefix}. ${node.name.firstname} ${node.name.middle_initial}. ${node.name.lastname}`,
      staff_id: node.staff_id,
    }))
  );
});

module.exports = route;
