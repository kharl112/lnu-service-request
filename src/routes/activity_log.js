const route = require("express").Router();

//models
const User = require("../db/models/user_model");
const Admin = require("../db/models/admin_model");
const ActivityLog = require("../db/models/activity_log_model");

//middlewares
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");
const activityLogQuery = require("../functions/activityLogQuery");

route.get("/faculty", userAuth, async (req, res) => {
  try {
    //get the staff_id from params
    const staff_id = req.locals.staff_id;

    //check if owner exists
    const owner = await User.findOne({ staff_id });
    if (!owner) return res.status(400).send({ message: "user not found" });

    //find activity logs and send back to client owner
    const activity_log = await ActivityLog.aggregate(
      activityLogQuery({ "user.staff_id": staff_id })
    );

    res.send(activity_log);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong, please try again" });
  }
});

route.get("/admin", adminAuth, async (req, res) => {
  try {
    //get the staff_id from params
    const staff_id = req.locals.staff_id;

    //check if owner exists
    const owner = await Admin.findOne({ staff_id });
    if (!owner)
      return res
        .status(400)
        .send({ message: "cao personnel account not found" });

    //find activity logs and send back to client owner
    const activity_log = await ActivityLog.aggregate(
      activityLogQuery({
        "user.staff_id": staff_id,
        "user.user_type": "admin",
      })
    );

    res.send(activity_log);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again" });
  }
});

module.exports = route;
