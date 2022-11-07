const route = require("express").Router();
const pdf = require("html-pdf");
const path = require("path");
const pug = require("pug");
const md = require("markdown-it")();

const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");

const Request = require("../db/models/request_model");

const requestQuery = require("../functions/requestQuery");
const { Name, _Date, Department } = require("../functions/generateProfile");
const { PROJECT_PATH } = require("../../path.config");

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

    form.date = _Date.getFullDate(form.reports.dates.created);
    form.service_type = form.service[0].type;

    const html = pug.renderFile(
      path.join(
        PROJECT_PATH +
          `/public/views/pdf/${form.service[0].component.toLowerCase()}.pug`
      ),
      { form }
    );

    const options = {
      format: form.service[0].paper_size,
      border: "0.8in",
    };

    console.log(PROJECT_PATH);
    console.log(html);

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

    form.date = _Date.getFullDate(form.reports.dates.created);
    form.service_type = form.service[0].type;

    const html = pug.renderFile(
      path.join(
        PROJECT_PATH +
          `/public/views/pdf/${form.service[0].component.toLowerCase()}.pug`
      ),
      { form }
    );

    const options = {
      format: form.service[0].paper_size,
      border: "0.8in",
    };

    console.log(PROJECT_PATH);
    console.log(html);

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

    form.date = _Date.getFullDate(form.reports.dates.created);
    form.service_type = form.service[0].type;

    const html = pug.renderFile(
      path.join(
        PROJECT_PATH +
          `/public/views/pdf/${form.service[0].component.toLowerCase()}.pug`
      ),
      { form }
    );

    const options = {
      format: form.options.paper_size,
      border: "0.8in",
    };

    console.log(PROJECT_PATH);
    console.log(html);

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
