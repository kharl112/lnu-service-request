const route = require("express").Router();
const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Admin = require("../db/models/admin_model");
const User = require("../db/models/user_model");
const Token = require("../db/models/token_model");

const generateEmail = require("../functions/generateEmail");
const { Name } = require("../functions/generateProfile");

const adminAuth = require("../authentication/adminAuth");
const userAuth = require("../authentication/userAuth");

const { create, login, update } = require("../validation/admin_validation");

route.post("/create", async (req, res) => {
  const form = { ...req.body };

  const { error } = create(form);
  if (error) return res.status(400).send(error.details[0]);

  const user_found = await User.find({
    $or: [{ email: form.email }, { staff_id: form.staff_id }],
  });

  const admin_found = await Admin.find({
    $or: [{ email: form.email }, { staff_id: form.staff_id }],
  });

  if (user_found[0] || admin_found[0])
    return res
      .status(400)
      .send({ message: "the email or ID number you provided already exists" });

  form.name = Name.getFixedFullName(form.name);
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(form.password, salt);

  const admin = new Admin({
    ...form,
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

  ["email", "permitted", "password", "staff_id"].map((node) =>
    form[node] ? delete form[node] : null
  );

  const { error } = update(form);
  if (error) return res.status(400).send(error.details[0]);

  form.name = Name.getFixedFullName(form.name);
  const { name } = form;
  await Admin.findOneAndUpdate(
    { staff_id: req.locals.staff_id },
    { name: name },
    { strict: "throw" }
  )
    .then(() => res.send({ message: "account successfully updated" }))
    .catch(() => {
      res
        .status(500)
        .send({ message: "we can't process your request, please try again." });
    });
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

route.post("/validate/email", async (req, res) => {
  const user_email_found = await User.findOne({ email: req.body.email });
  const admin_email_found = await Admin.findOne({ email: req.body.email });

  if (user_email_found || admin_email_found)
    return res.status(400).send({ message: "this email already exists" });

  return res.send({ email: req.body.email });
});

route.post("/send/email/link", async (req, res) => {
  const email_found = await Admin.findOne({ email: req.body.email });
  if (!email_found) return res.status(400).send({ message: "email not found" });

  const token = jwt.sign({ _id: email_found._id }, process.env.PASSWORD_RESET, {
    expiresIn: 300000,
  });

  const mail = nodemailer.createTransport(generateEmail.transport);

  try {
    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/reset_password.pug"),
      {
        form: {
          link: `https://lnusr.herokuapp.com/admin/forgot/password/reset/${token}`,
          firstname: email_found.name.firstname,
        },
      }
    );
    await mail.sendMail(
      generateEmail.options(
        email_found.email,
        "LnuSR account retrieval",
        html.toString()
      )
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

route.post("/email/permission/code/:staff_id", adminAuth, async (req, res) => {
  const { staff_id } = req.params;

  const user_found = await User.findOne({ staff_id: staff_id });
  if (!user_found) return res.status(400).send({ message: "user not found" });

  const user_token = new Token({
    creatorID: req.locals.staff_id,
    token: Math.random().toString(36).substring(4),
  });

  try {
    await user_token.save();
    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/request_permission.pug"),
      {
        form: {
          link: `https://lnusr.herokuapp.com/faculty/login`,
          admin: req.locals.name,
          user: user_found.name,
          token: user_token.token,
        },
      }
    );

    const mail = nodemailer.createTransport(generateEmail.transport);

    await mail.sendMail(
      generateEmail.options(
        user_found.email,
        "LnuSR sent you a account permission code",
        html
      )
    );
    return res.send({ message: `the code was sent to ${user_found.staff_id}` });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
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
      name: Name.getFullName(node.name),
      staff_id: node.staff_id,
    }))
  );
});

module.exports = route;
