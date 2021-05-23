const route = require("express").Router();
const { create, deleteSelected } = require("../validation/request_validation");
const userAuth = require("../authentication/userAuth");
const adminAuth = require("../authentication/adminAuth");
const User = require("../db/models/user_model");
const Admin = require("../db/models/admin_model");
const Request = require("../db/models/request_model");

route.post("/create", userAuth, async (req, res) => {
  const { error } = create(req.body);
  if (error) return res.status(400).send(error.details[0]);

  const admin_found = await Admin.findOne({
    staff_id: req.body.admin.staff_id,
  });
  if (!admin_found) return res.status(400).send({ message: "admin not found" });

  if (req.body.head.staff_id) {
    const head_found = await User.findOne({
      staff_id: req.body.head.staff_id,
      "department.unit_role": { $in: [2, 3] },
    });
    if (!head_found)
      return res.status(400).send({ message: "head dept. not found" });
  }

  const request = new Request({
    ...req.body,
    user: { staff_id: req.locals.staff_id, ...req.body.user },
  });

  try {
    const new_request = await request.save();
    return res.send({
      message: `request ${req.body.save_as === 0 ? "saved as draft" : "sent"}`,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/faculty/draft/delete/selected", userAuth, async (req, res) => {
  const { error } = deleteSelected(req.body);
  if (error) return res.status(400).send(error.details[0]);

  try {
    await Request.find({
      "user.staff_id": req.locals.staff_id,
      _id: { $in: req.body.selected },
    }).deleteMany();

    return res.send({ message: "selected requests deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.get("/faculty/draft", userAuth, async (req, res) => {
  const faculty_drafts = await Request.find({
    "user.staff_id": req.locals.staff_id,
    save_as: 0,
  });
  return res.send(faculty_drafts);
});

route.get("/faculty/sent", userAuth, async (req, res) => {
  const faculty_sent = await Request.find({
    "user.staff_id": req.locals.staff_id,
    save_as: 1,
  });
  return res.send(faculty_sent);
});

route.get("/admin/sent", adminAuth, async (req, res) => {
  const admin_sent = await Request.find({
    "user.staff_id": req.locals.staff_id,
    save_as: 1,
  });
  return res.send(admin_sent);
});

route.get("/faculty/letter=:id", userAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const form = await Request.findOne({
      _id: id,
      "user.staff_id": req.locals.staff_id,
      save_as: 0,
    }).select({ _id: 0, __v: 0, date: 0, "user.staff_id": 0 });

    return res.send({ form });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.get("/head/pending", userAuth, async (req, res) => {
  const head_pending = await Request.find({
    "head.staff_id": req.locals.staff_id,
    "head.signature": "",
    save_as: 1,
  });
  return res.send(head_pending);
});

route.get("/head/signed", userAuth, async (req, res) => {
  const head_signed = await Request.find({
    "head.staff_id": req.locals.staff_id,
    "head.signature": { $ne: "" },
    save_as: 1,
  });
  return res.send(head_signed);
});

route.post("/head/sign", userAuth, async (req, res) => {
  if (req.locals.department.unit_role === 1)
    return res.status(401).send({ message: "invalid user type" });

  try {
    const head_sign = await Request.findByIdAndUpdate(req.body.request_id, {
      "head.signature": req.body.signature,
    });
    if (!head_sign)
      return res
        .status(500)
        .send({ message: "something went wrong, please try again." });

    return res.send({ message: "signing complete" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
    I;
  }
});

route.get("/admin/pending", adminAuth, async (req, res) => {
  const admin_pending = await Request.find({
    "admin.staff_id": req.locals.staff_id,
    "admin.signature": "",
    save_as: 1,
  });
  return res.send(admin_pending);
});

route.get("/admin/signed", adminAuth, async (req, res) => {
  const admin_signed = await Request.find({
    "admin.staff_id": req.locals.staff_id,
    "admin.signature": { $ne: "" },
    save_as: 1,
  });
  return res.send(admin_signed);
});

route.post("/admin/sign", adminAuth, async (req, res) => {
  try {
    const admin_sign = await Request.findByIdAndUpdate(req.body.request_id, {
      "admin.signature": req.body.signature,
    });
    if (!admin_sign)
      return res
        .status(500)
        .send({ message: "something went wrong, please try again." });

    return res.send({ message: "signing complete" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
    I;
  }
});

route.post("/faculty/update/letter=:id", userAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = create(req.body.form);
  if (error) return res.status(400).send(error.details[0]);
  req.body.form.user.staff_id = req.locals.staff_id;

  try {
    const updated_request = await Request.findByIdAndUpdate(id, req.body.form);
    if (!updated_request)
      return res.status(404).send({ message: "request letter not found." });
    return res.send({ message: "request letter updated" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

module.exports = route;
