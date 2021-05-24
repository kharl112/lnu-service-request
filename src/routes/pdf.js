const route = require("express").Router();
const pdf = require("html-pdf");
const mongoose = require("mongoose");
const path = require("path");
const pug = require("pug");
const userAuth = require("../authentication/userAuth");
const Request = require("../db/models/request_model");

route.post("/faculty/create/id=:id", userAuth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const form = await Request.aggregate([
      {
        $match: {
          _id: id,
          "user.staff_id": req.locals.staff_id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "head.staff_id",
          foreignField: "staff_id",
          as: "head.profile",
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "admin.staff_id",
          foreignField: "staff_id",
          as: "admin.profile",
        },
      },
      {
        $project: {
          _id: 0,
          save_as: 0,
          "admin.profile.password": 0,
          "head.profile.password": 0,
          "admin.profile._id": 0,
          "head.profile._id": 0,
          "admin.profile.email": 0,
          "head.profile.email": 0,
          "admin.profile.permitted": 0,
          "head.profile.permitted": 0,
          "admin.profile.__v": 0,
          "head.profile.__v": 0,
        },
      },
    ]);

    const { options } = form[0];
    Object.keys(options.border).map(
      (node) => (options.border[node] = `${options.border[node]}in`)
    );

    const getDepartment = ({ unit_role, unit_name }) =>
      `${unit_name} ${unit_role === 1 ? "" : "Head"} Department`;

    const getFullName = (name) =>
      `${name.prefix ? `${name.prefix}.` : ""} ${name.firstname} ${
        name.middle_initial
      }. ${name.lastname} ${name.suffixes.toString()}`;

    form[0].head.department = !form[0].head.staff_id
      ? ""
      : getDepartment(form[0].head.profile[0].department);

    form[0].head.profile = !form[0].head.staff_id
      ? ""
      : getFullName(form[0].head.profile[0].name);

    form[0].user.department = getDepartment(req.locals.department);
    form[0].admin.profile = getFullName(form[0].admin.profile[0].name);
    form[0].user.profile = getFullName(req.locals.name);

    const link = `file://${path.join(__dirname + "/../../public/views/")}`;
    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/template1.pug"),
      { link, form: form[0] }
    );

    return await pdf.create(html, form[0].options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

module.exports = route;
