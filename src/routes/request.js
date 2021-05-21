const route = require("express").Router();
const { create, deleteSelected } = require("../validation/request_validation");
const userAuth = require("../authentication/userAuth");
const adminAuth = require("../authentication/adminAuth");
const User = require("../db/models/user_model");
const Admin = require("../db/models/admin_model");
const Request = require("../db/models/request_model");

route.post("/create", userAuth, async (req, res) => {
  const borderToString = (position) => `${position}in`;
  req.body.options.border.top = borderToString(req.body.options.border.top);
  req.body.options.border.right = borderToString(req.body.options.border.right);
  req.body.options.border.bottom = borderToString(
    req.body.options.border.bottom
  );
  req.body.options.border.left = borderToString(req.body.options.border.left);

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

route.get("/letter=:id", userAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const form = await Request.findOne({
      _id: id,
      "user.staff_id": req.locals.staff_id,
    });
    return res.send({ form });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

module.exports = route;
