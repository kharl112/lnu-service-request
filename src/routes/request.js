const route = require("express").Router();
const { create } = require("../validation/request_validation");
const userAuth = require("../authentication/userAuth");
const User = require("../db/models/user_model");
const Admin = require("../db/models/admin_model");
const Request = require("../db/models/request_model");
const { reset } = require("nodemon");

route.post("/create", userAuth, async (req, res) => {
  const { error } = create(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const admin_found = await Admin.findOne({
    staff_id: req.body.admin.staff_id,
  });
  if (!admin_found) return res.status(400).send({ message: "admin not found" });

  if (req.body.head.staff_id) {
    const head_found = await User.findOne({
      staff_id: req.body.head.staff_id,
      "department.unit_rolw": 2 || 3,
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

module.exports = route;
