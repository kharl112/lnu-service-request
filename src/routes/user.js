const route = require("express").Router();
const User = require("../db/models/user_model");
const { create, login } = require("../validation/user_validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userAuth = require("../authentication/userAuth");
require("dotenv").config();

route.post("/create", async (req, res) => {
  req.body.name.middle_initial = req.body.name.middle_initial.toUpperCase();
  req.body.name.suffixes = req.body.name.suffixes.split(",");

  const { error } = create(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user_email_found = await User.findOne({ email: req.body.email });
  if (user_email_found)
    return res.status(400).send({ message: "this email already exists." });

  const user_staff_id = await User.findOne({ staff_id: req.body.staff_id });
  if (user_staff_id)
    return res.status(400).send({ message: "staff_id  already exists." });

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const user = new User({
    ...req.body,
    password: hash,
    signature_url: {},
    permitted: false,
  });

  try {
    const new_user = await user.save();
    const token = jwt.sign({ _id: new_user._id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    return res.send({ token });
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
      expiresIn: "1h",
    });
    return res.send({ token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "we can't process your request, please try again." });
  }
});

route.post("/validate/email", async (req, res) => {
  const email_found = await User.findOne({ email: req.body.email });
  if (email_found)
    return res.status(400).send({ message: "this email already exists" });

  return res.send({ email: req.body.email });
});

route.get("/profile", userAuth, async (req, res) => {
  return res.send(req.locals);
});

route.get("/head/all", userAuth, async (req, res) => {
  const all_head = await User.find({ "department.unit_role": 3 || 4 }).select({
    _id: 0,
    email: 0,
    password: 0,
    signature_url: 0,
    __v: 0,
  });
  return res.send(all_head);
});

module.exports = route;
