const route = require("express").Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pug = require("pug");
const path = require("path");
require("dotenv").config();

const User = require("../db/models/user_model");
const Admin = require("../db/models/admin_model");
const Unit = require("../db/models/unit_model");
const Role = require("../db/models/role_model");

const generateEmail = require("../functions/generateEmail");
const generateToken = require("../functions/generateToken");
const { create, login, update } = require("../validation/user_validation");
const { Name, Department } = require("../functions/generateProfile");

const userAuth = require("../authentication/userAuth");
const adminAuth = require("../authentication/adminAuth");

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

  const unit_found = await Unit.findById(form.department.unit_id);
  const role_found = await Role.findById(form.department.role_id);

  if (!unit_found || !role_found)
    return res
      .status(400)
      .send({ message: "we cant find either of the unit or role field" });

  form.name = Name.getFixedFullName(form.name);
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(form.password, salt);

  const user = new User({
    ...form,
    password: hash,
    permitted: false,
  });

  try {
    const new_user = await user.save();
    const new_token = await generateToken(null, new_user.staff_id);

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/request_permission.pug"),
      {
        form: {
          link: `https://lnusr.herokuapp.com/user/login`,
          user: new_user.name,
          token: new_token,
        },
      }
    );

    const mail = nodemailer.createTransport(generateEmail.transport);
    await mail.sendMail(
      generateEmail.options(
        new_user.email,
        "LnuSR sent you a account permission code",
        html
      )
    );

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

  ["email", "permitted", "password", "staff_id", "role"].map((node) =>
    form[node] ? delete form[node] : null
  );

  form.name.suffixes = form.name.suffixes.toString();

  const { error } = update(form);
  if (error) return res.status(400).send(error.details[0]);

  const unit_found = await Unit.findById(form.department.unit_id);
  const role_found = await Role.findById(form.department.role_id);

  if (!unit_found || !role_found)
    return res
      .status(400)
      .send({ message: "we cant find either of the unit or role field" });

  form.name = Name.getFixedFullName(form.name);
  await User.findOneAndUpdate(
    { staff_id: req.locals.staff_id },
    { ...form },
    { strict: "throw" },
    (error) => {
      if (error)
        return res.status(500).send({
          message: "we can't process your request, please try again.",
        });
      return res.send({ message: "account successfully updated" });
    }
  );
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
          link: `https://lnusr.herokuapp.com/faculty/forgot/password/reset/${token}`,
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
  const profile = await User.aggregate([
    { $match: { staff_id: req.locals.staff_id } },
    {
      $lookup: {
        from: "roles",
        localField: "department.role_id",
        foreignField: "_id",
        as: "role",
      },
    },
    {
      $project: {
        _id: 0,
        password: 0,
        __v: 0,
        "unit.__v": 0,
        "role.__v": 0,
      },
    },
  ]);

  const role = profile[0].role[0];
  return res.send({ ...profile[0], role });
});

route.get("/all", adminAuth, async (req, res) => {
  const all_users = await User.find({}).select({ _id: 0, password: 0, __v: 0 });
  return res.send(all_users);
});

route.get("/permitted", adminAuth, async (req, res) => {
  const permitted_users = await User.find({ permitted: true }).select({
    _id: 0,
    password: 0,
    __v: 0,
  });
  return res.send(permitted_users);
});

route.get("/pending", adminAuth, async (req, res) => {
  const pending_users = await User.find({ permitted: false }).select({
    _id: 0,
    password: 0,
    __v: 0,
  });
  return res.send(pending_users);
});

route.get("/provider/all", userAuth, async (req, res) => {
  const all_service_provider = await User.aggregate([
    { $match: { staff_id: { $ne: req.locals.staff_id } } },
    {
      $lookup: {
        from: "roles",
        localField: "department.role_id",
        foreignField: "_id",
        as: "role",
      },
    },
    {
      $lookup: {
        from: "units",
        localField: "department.unit_id",
        foreignField: "_id",
        as: "unit",
      },
    },
    {
      $project: {
        _id: 0,
        password: 0,
        __v: 0,
        department: 0,
        "unit.__v": 0,
        "role.__v": 0,
      },
    },
  ]);

  return res.send(
    all_service_provider.map((node) => ({
      text: `${Name.getFullName(node.name)} (${Department.getFullDepartment({
        unit: node.unit,
        role: node.role,
      })})`,
      staff_id: node.staff_id,
    }))
  );
});

module.exports = route;
