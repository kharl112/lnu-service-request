const route = require("express").Router();
const Admin = require("../db/models/admin_model");
const { create, login } = require("../validation/admin_validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

route.post("/create", async (req, res) => {
  const { error } = create(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const found = await Admin.findOne({ email: req.body.email });
  if (found)
    return res.status(400).send({ message: "this email already exists." });

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const admin = new Admin({
    staff_id: req.body.staff_id,
    name: req.body.name,
    email: req.body.email,
    password: hash,
    permitted: false,
  });

  try {
    const new_admin = await admin.save();
    const token = jwt.sign({ _id: new_admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.send({ token });
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
      expiresIn: "1h",
    });
    return res.send({ token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "we can't process your request, please try again." });
  }
});

module.exports = route;
