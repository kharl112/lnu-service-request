const route = require("express").Router();
const pdf = require("html-pdf");
const path = require("path");
const pug = require("pug");
const md = require("markdown-it")();

const userAuth = require("../authentication/userAuth");
const adminAuth = require("../authentication/adminAuth");

const Request = require("../db/models/request_model");

const requestQuery = require("../functions/requestQuery");
const { Name, _Date, Department } = require("../functions/generateProfile");
const getTemplateType = require("../functions/getTemplateType");

route.post("/faculty/create/id=:id", userAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const [form] = await Request.aggregate(
      requestQuery({ _id: id, "user.staff_id": req.locals.staff_id })
    );

    form.user.department = Department.getFullDepartment(form.user.department);
    form.user.profile = Name.getFullName(req.locals.name);

    if (form.service_provider.staff_id) {
      form.service_provider.department = Department.getFullDepartment(
        form.service_provider.department
      );
      form.service_provider.profile = Name.getFullName(
        form.service_provider.profile[0].name
      );
    }

    form.admin.profile = Name.getFullName(form.admin.profile[0].name);

    form.body = md.render(form.body).toString();
    form.date = _Date.getFullDate(form.date);
    form.service_type = form.service[0].type;

    const temp = getTemplateType(form.service_id);
    const html = pug.renderFile(
      path.join(__dirname + `/../../public/views/pdf/${temp}.pug`),
      { form }
    );

    const options = {
      format: temp === "mailing" ? "Legal" : "A4",
      border: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
    };

    return pdf.create(html, options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again" });
  }
});

route.post("/provider/create/id=:id", userAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const [form] = await Request.aggregate(
      requestQuery({
        _id: id,
        "service_provider.staff_id": req.locals.staff_id,
      })
    );

    form.user.department = Department.getFullDepartment(form.user.department);
    form.user.profile = Name.getFullName(form.user.profile[0].name);

    if (form.service_provider.staff_id) {
      form.service_provider.department = Department.getFullDepartment(
        form.service_provider.department
      );
      form.service_provider.profile = Name.getFullName(
        form.service_provider.profile[0].name
      );
    }

    form.admin.profile = Name.getFullName(form.admin.profile[0].name);

    form.body = md.render(form.body).toString();
    form.date = _Date.getFullDate(form.date);
    form.service_type = form.service[0].type;

    const temp = getTemplateType(form.service_id);
    const html = pug.renderFile(
      path.join(__dirname + `/../../public/views/pdf/${temp}.pug`),
      { form }
    );

    const options = {
      format: temp === "mailing" ? "Legal" : "A4",
      border: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
    };

    return pdf.create(html, options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again" });
  }
});

route.post("/admin/create/id=:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const [form] = await Request.aggregate(
      requestQuery({ _id: id, "admin.staff_id": req.locals.staff_id })
    );

    form.user.department = Department.getFullDepartment(form.user.department);
    form.user.profile = Name.getFullName(form.user.profile[0].name);

    if (form.service_provider.staff_id) {
      form.service_provider.department = Department.getFullDepartment(
        form.service_provider.department
      );
      form.service_provider.profile = Name.getFullName(
        form.service_provider.profile[0].name
      );
    }

    form.admin.profile = Name.getFullName(form.admin.profile[0].name);

    form.body = md.render(form.body).toString();
    form.date = _Date.getFullDate(form.date);
    form.service_type = form.service[0].type;

    const temp = getTemplateType(form.service_id);
    const html = pug.renderFile(
      path.join(__dirname + `/../../public/views/pdf/${temp}.pug`),
      { form }
    );

    const options = {
      format: temp === "mailing" ? "Legal" : "A4",
      border: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
    };

    return pdf.create(html, options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again" });
  }
});

module.exports = route;
