const route = require("express").Router();
const pdf = require("html-pdf");
const mongoose = require("mongoose");
const path = require("path");
const pug = require("pug");
const userAuth = require("../authentication/userAuth");
const adminAuth = require("../authentication/adminAuth");
const Request = require("../db/models/request_model");
const pdfQuery = require("../functions/pdfQuery");
const { getFullName, getDepartment } = require("../functions/generateProfile");

route.post("/faculty/create/id=:id", userAuth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const form = await Request.aggregate(
      pdfQuery(id, "user.staff_id", req.locals.staff_id)
    );

    const { options } = form[0];
    Object.keys(options.border).map(
      (node) => (options.border[node] = `${options.border[node]}in`)
    );

    form[0].head.department = !form[0].head.staff_id
      ? ""
      : getDepartment(form[0].head.profile[0].department);

    form[0].head.profile = !form[0].head.staff_id
      ? ""
      : getFullName(form[0].head.profile[0].name);

    form[0].user.department = getDepartment(req.locals.department);
    form[0].user.profile = getFullName(req.locals.name);
    form[0].admin.profile = getFullName(form[0].admin.profile[0].name);

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/template1.pug"),
      { form: form[0] }
    );

    return await pdf.create(html, form[0].options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (e) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/head/create/id=:id", userAuth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const form = await Request.aggregate(
      pdfQuery(id, "head.staff_id", req.locals.staff_id)
    );

    const { options } = form[0];
    Object.keys(options.border).map(
      (node) => (options.border[node] = `${options.border[node]}in`)
    );

    form[0].head.department = !form[0].head.staff_id
      ? ""
      : getDepartment(form[0].head.profile[0].department);

    form[0].head.profile = !form[0].head.staff_id
      ? ""
      : getFullName(form[0].head.profile[0].name);

    form[0].user.department = getDepartment(form[0].user.profile[0].department);
    form[0].user.profile = getFullName(form[0].user.profile[0].name);
    form[0].admin.profile = getFullName(form[0].admin.profile[0].name);

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/template1.pug"),
      { form: form[0] }
    );

    return await pdf.create(html, form[0].options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (e) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/admin/create/id=:id", adminAuth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const form = await Request.aggregate(
      pdfQuery(id, "admin.staff_id", req.locals.staff_id)
    );

    const { options } = form[0];
    Object.keys(options.border).map(
      (node) => (options.border[node] = `${options.border[node]}in`)
    );

    form[0].head.department = !form[0].head.staff_id
      ? ""
      : getDepartment(form[0].head.profile[0].department);

    form[0].head.profile = !form[0].head.staff_id
      ? ""
      : getFullName(form[0].head.profile[0].name);

    form[0].user.department = getDepartment(form[0].user.profile[0].department);
    form[0].user.profile = getFullName(form[0].user.profile[0].name);
    form[0].admin.profile = getFullName(form[0].admin.profile[0].name);

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/template1.pug"),
      { form: form[0] }
    );

    return await pdf.create(html, form[0].options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (e) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

module.exports = route;
