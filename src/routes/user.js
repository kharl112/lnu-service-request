const route = require("express").Router();
const User = require("../db/models/user_model");
const { create } = require("../validation/user_validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

route.post("/create", async (req, res) => {
  const { error } = create(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const found = await User.findOne({ email: req.body.email });
  if (found)
    return res.status(400).send({ message: "this email already exists." });

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const user = new User({
    staff_id: req.body.staff_id,
    name: req.body.name,
    email: req.body.email,
    password: hash,
    department: req.body.department,
    signature_url: "",
  });

  try {
    const new_user = await user.save();
    const token = jwt.sign({ _id: new_user._id }, process.env.JWT_SECRET, {
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
