const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pug = require("pug");
const path = require("path");
require("dotenv").config();

const User = require("../../../db/models/user_model");
const Admin = require("../../../db/models/admin_model");
const Unit = require("../../../db/models/unit_model");
const Role = require("../../../db/models/role_model");

const generateEmail = require("../../../functions/generateEmail");
const generateToken = require("../../../functions/generateToken");
const validate = require("../../../validation/user_validation");
const { Name } = require("../../../functions/generateProfile");

module.exports = (() => {
  const create = async (req, res) => {
    const form = { ...req.body };
    delete form.user;
    const { error } = validate.create(form);
    if (error) return res.status(400).send(error.details[0]);

    const user_found = await User.find({
      $or: [{ email: form.email }, { staff_id: form.staff_id }],
    });
    const admin_found = await Admin.find({
      $or: [{ email: form.email }, { staff_id: form.staff_id }],
    });

    if (user_found[0] || admin_found[0])
      return res.status(400).send({
        message: "the email or ID number you provided already exists",
      });

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
      permitted: true,
    });

    try {
      const new_user = await user.save();
      const new_token = await generateToken(null, new_user.staff_id);

      const token = jwt.sign({ _id: new_user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "we can't process your request, please try again." });
    }
  };

  const update = async (req, res) => {
    const form = { ...req.body };

    ["email", "permitted", "password", "staff_id", "role"].map((node) =>
      form[node] ? delete form[node] : null
    );

    form.name.suffixes = form.name.suffixes.toString();

    const { error } = validate.update(form);
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
  };

  const login = async (req, res) => {
    const { error } = validate.login(req.body);
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
  };

  const reset_pass = async (req, res) => {
    const { new_password } = req.body;
    const { _id_token } = req.params;

    if (!_id_token) return res.status(500).send({ message: "empty parameter" });

    try {
      const { _id } = jwt.verify(_id_token, process.env.PASSWORD_RESET);

      const user_found = await User.findById(_id);
      if (!user_found)
        return res.status(400).send({ message: "account not found" });

      const same_password = bcrypt.compareSync(
        new_password,
        user_found.password
      );
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
  };

  const change_pass = async (req, res) => {
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
  };

  return { create, update, login, reset_pass, change_pass };
})();
