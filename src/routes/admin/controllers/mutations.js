const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Admin = require("../../../db/models/admin_model");
const User = require("../../../db/models/user_model");

const generateToken = require("../../../functions/generateToken");
const generateEmail = require("../../../functions/generateEmail");
const { Name } = require("../../../functions/generateProfile");

const validate = require("../../../validation/admin_validation");

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
      const new_token = await generateToken(null, new_admin.staff_id);

      const html = pug.renderFile(
        path.join(
          __dirname + "../../../../../public/views/request_permission.pug"
        ),
        {
          form: {
            link: `https://lnusr.herokuapp.com/admin/login`,
            user: new_admin.name,
            token: new_token,
          },
        }
      );

      const mail = nodemailer.createTransport(generateEmail.transport);
      await mail.sendMail(
        generateEmail.options(new_admin.email, "Account permission code", html)
      );
      const token = jwt.sign({ _id: new_admin._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong, please try again." });
    }
  };

  const update = async (req, res) => {
    const form = { ...req.body };

    ["email", "permitted", "password", "staff_id"].map((node) =>
      form[node] ? delete form[node] : null
    );

    form.name.suffixes = form.name.suffixes.toString();

    const { error } = validate.update(form);
    if (error) return res.status(400).send(error.details[0]);

    form.name = Name.getFixedFullName(form.name);
    const { name } = form;
    await Admin.findOneAndUpdate(
      { staff_id: req.locals.staff_id },
      { name },
      { strict: "throw" }
    )
      .then(() => res.send({ message: "account successfully updated" }))
      .catch(() => {
        res.status(500).send({
          message: "we can't process your request, please try again.",
        });
      });
  };

  const login = async (req, res) => {
    const { error } = validate.login(req.body);
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

      let permitted = true;
      if (!admin_found.permitted) permitted = false;

      return res.send({ token, permitted });

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
  };

  const change_pass = async (req, res) => {
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
  };

  return { create, update, login, reset_pass, change_pass };
})();
