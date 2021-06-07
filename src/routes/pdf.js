const route = require("express").Router();
const pdf = require("html-pdf");
const mongoose = require("mongoose");
const path = require("path");
const pug = require("pug");
const md = require("markdown-it")();

const userAuth = require("../authentication/userAuth");
const adminAuth = require("../authentication/adminAuth");

const Request = require("../db/models/request_model");

const pdfQuery = require("../functions/pdfQuery");
const { Name, Department, _Date } = require("../functions/generateProfile");

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
      : Department.getDepartment(form[0].head.profile[0].department);

    form[0].head.profile = !form[0].head.staff_id
      ? ""
      : Name.getFullName(form[0].head.profile[0].name);

    form[0].user.department = Department.getDepartment(req.locals.department);
    form[0].user.profile = Name.getFullName(req.locals.name);
    form[0].admin.profile = Name.getFullName(form[0].admin.profile[0].name);
    form[0].body = md.render(form[0].body).toString();
    form[0].date = _Date.getFullDate(form[0].date);

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/template1.pug"),
      { form: form[0] }
    );

    return pdf.create(html, form[0].options).toBuffer((e, buffer) => {
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
      : Department.getDepartment(form[0].head.profile[0].department);

    form[0].head.profile = !form[0].head.staff_id
      ? ""
      : Name.getFullName(form[0].head.profile[0].name);

    form[0].user.department = Department.getDepartment(
      form[0].user.profile[0].department
    );

    form[0].user.profile = Name.getFullName(form[0].user.profile[0].name);
    form[0].admin.profile = Name.getFullName(form[0].admin.profile[0].name);
    form[0].body = md.render(form[0].body).toString();
    form[0].date = _Date.getFullDate(form[0].date);

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/template1.pug"),
      { form: form[0] }
    );

    return pdf.create(html, form[0].options).toBuffer((e, buffer) => {
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
      : Department.getDepartment(form[0].head.profile[0].department);

    form[0].head.profile = !form[0].head.staff_id
      ? ""
      : Name.getFullName(form[0].head.profile[0].name);

    form[0].user.department = Department.getDepartment(
      form[0].user.profile[0].department
    );

    form[0].user.profile = Name.getFullName(form[0].user.profile[0].name);
    form[0].admin.profile = Name.getFullName(form[0].admin.profile[0].name);
    form[0].body = md.render(form[0].body).toString();
    form[0].date = _Date.getFullDate(form[0].date);

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/template1.pug"),
      { form: form[0] }
    );

    return pdf.create(html, form[0].options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (e) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

module.exports = route;
