const route = require("express").Router();
const Admin = require("../db/models/admin_model");
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

  const email_found = await User.findOne({ email: form.email });
  if (email_found)
    return res.status(400).send({ message: "this email already exists." });

  const user_staff_id = await User.findOne({ staff_id: form.staff_id });
  if (user_staff_id)
    return res.status(400).send({ message: "staff_id  already exists." });

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

route.post("/update", async (req, res) => {
  const form = { ...req.body };

  await ["email", "permitted", "password"].map((node) =>
    form[node] ? delete form[node] : null
  );

  if (typeof form.name.suffixes !== "object")
    form.name.suffixes = form.name.suffixes.split(",");

  const { error } = update(form);
  if (error) return res.status(400).send(error.details[0]);

  form.name.middle_initial = form.name.middle_initial.toUpperCase();
  form.name.firstname = getFixedName(form.name.firstname);
  form.name.lastname = getFixedName(form.name.lastname);

  const user_staff_id = await User.findOne({ staff_id: form.staff_id });
  if (user_staff_id)
    return res.status(400).send({ message: "staff_id  already exists." });

  try {
    const updated_admin = await Admin.findOneAndUpdate(
      {
        staff_id: req.locals.staff_id,
        email: { $ne: req.locals.email },
      },
      { ...form }
    );

    if (!updated_admin)
      return res
        .status(500)
        .send({ message: "we can't process your request, please try again." });

    return res.send({ message: "account successfully updated" });
  } catch (error) {
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
