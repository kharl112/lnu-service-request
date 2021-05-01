const route = require("express").Router();
const Admin = require("../db/models/admin_model");
const { create } = require("../validation/admin_validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

route.post("/create", async (req, res) => {
  const { error } = create(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const found = await Admin.findOne({ email: req.body.email });
  if (found)
    return res
      .status(400)
      .send(message(false, "this email already exist, login to continue"));

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const user = new Admin({
    staff_id: req.body.staff_id,
    name: req.body.name,
    email: req.body.email,
    password: hash,
    permitted: false,
  });

  try {
    const admin = await user.save();
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.send({ token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

module.exports = route;
