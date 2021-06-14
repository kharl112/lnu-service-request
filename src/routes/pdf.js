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
    const [form] = await Request.aggregate(
      pdfQuery(id, "user.staff_id", req.locals.staff_id)
    );

    const { options } = form;
    Object.keys(options.border).map(
      (node) => (options.border[node] = `${options.border[node]}in`)
    );

    form.head.department = !form.head.staff_id
      ? ""
      : `${form.head.department.role[0].name} of ${form.head.department.unit[0].name}`;

    form.head.profile = !form.head.staff_id
      ? ""
      : Name.getFullName(form.head.profile[0].name);

    const { unit, role } = form.user.department;
    form.user.department = `${role[0].name} of ${unit[0].name}`;
    form.user.profile = Name.getFullName(req.locals.name);
    form.admin.profile = Name.getFullName(form.admin.profile[0].name);
    form.body = md.render(form.body).toString();
    form.date = _Date.getFullDate(form.date);
    form.service_type = form.service[0].type;

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/template1.pug"),
      { form }
    );

    return pdf.create(html, options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/head/create/id=:id", userAuth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const [form] = await Request.aggregate(
      pdfQuery(id, "head.staff_id", req.locals.staff_id)
    );

    const { options } = form;
    Object.keys(options.border).map(
      (node) => (options.border[node] = `${options.border[node]}in`)
    );

    form.head.department = !form.head.staff_id
      ? ""
      : `${form.head.department.role[0].name} of ${form.head.department.unit[0].name}`;

    form.head.profile = !form.head.staff_id
      ? ""
      : Name.getFullName(form.head.profile[0].name);

    const { unit, role } = form.user.department;
    form.user.department = `${role[0].name} of ${unit[0].name}`;
    form.user.profile = Name.getFullName(form.user.profile[0].name);
    form.admin.profile = Name.getFullName(form.admin.profile[0].name);
    form.body = md.render(form.body).toString();
    form.date = _Date.getFullDate(form.date);
    form.service_type = form.service[0].type;

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/template1.pug"),
      { form }
    );

    return pdf.create(html, options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/admin/create/id=:id", adminAuth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const [form] = await Request.aggregate(
      pdfQuery(id, "admin.staff_id", req.locals.staff_id)
    );

    const { options } = form;
    Object.keys(options.border).map(
      (node) => (options.border[node] = `${options.border[node]}in`)
    );

    form.head.department = !form.head.staff_id
      ? ""
      : `${form.head.department.role[0].name} of ${form.head.department.unit[0].name}`;

    form.head.profile = !form.head.staff_id
      ? ""
      : Name.getFullName(form.head.profile[0].name);

    const { unit, role } = form.user.department;
    form.user.department = `${role[0].name} of ${unit[0].name}`;
    form.user.profile = Name.getFullName(form.user.profile[0].name);
    form.admin.profile = Name.getFullName(form.admin.profile[0].name);
    form.body = md.render(form.body).toString();
    form.date = _Date.getFullDate(form.date);
    form.service_type = form.service[0].type;

    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/template1.pug"),
      { form }
    );

    return pdf.create(html, options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

module.exports = route;
