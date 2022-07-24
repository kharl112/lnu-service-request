const route = require("express").Router();

//models
const User = require("../db/models/user_model");
const Admin = require("../db/models/admin_model");
const Notification = require("../db/models/notification_model");

//middlewares
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");
const notificationQuery = require("../functions/notificationQuery");

route.get("/faculty", userAuth, async (req, res) => {
  try {
    //get the staff_id from params
    const staff_id = req.locals.staff_id;

    //check if owner exists
    const owner = await User.findOne({ staff_id });
    if (!owner) return res.status(400).send({ message: "user not found" });

    //set the options for query
    const match = {
      "user.staff_id": staff_id,
    };

    //check if query params unread is present
    if (req.query.unread) {
      match.unread = req.query.unread === "true" ? true : false;
    }

    //find activity logs and send back to client owner
    const notifications = await Notification.aggregate(
      notificationQuery(match)
    );

    res.send(notifications);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again" });
  }
});

route.post("/faculty/read/id=:notification_id", userAuth, async (req, res) => {
  try {
    //get notification_id from the parameters
    const { notification_id } = req.params;
    const staff_id = req.locals.staff_id;

    //check if notification_id exists
    if (!notification_id)
      return res.status(402).send({ message: "Unprocessable request" });

    //update notification from the id
    const updated_notif = await Notification.findOneAndUpdate(
      {
        _id: notification_id,
        "user.staff_id": staff_id,
      },
      {
        unread: false,
      }
    );

    res.send({ message: `notification id: ${updated_notif._id} updated` });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again" });
  }
});

route.post("/faculty/read/all", userAuth, async (req, res) => {
  try {
    const staff_id = req.locals.staff_id;

    //mark all notifications as read
    const updated_notif = await Notification.updateMany(
      {
        "user.staff_id": staff_id,
      },
      { unread: false }
    );

    res.send({ message: "all messages marked as read" });
  } catch (error) {
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

    //set the options for query
    const match = {
      "user.staff_id": staff_id,
      "user.user_type": "admin",
    };

    //check if query params unread is present
    if (req.query.unread) {
      match.unread = req.query.unread === "true" ? true : false;
    }

    //find activity logs and send back to client owner
    const notifications = await Notification.aggregate(
      notificationQuery(match)
    );

    res.send(notifications);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again" });
  }
});

route.post("/admin/read/all", adminAuth, async (req, res) => {
  try {
    const staff_id = req.locals.staff_id;

    //marked notification as read
    const updated_notif = await Notification.updateMany(
      {
        "user.staff_id": staff_id,
      },
      { unread: false }
    );

    res.send({ message: "all notifications marked as read" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again" });
  }
});

route.post("/admin/read/id=:notification_id", adminAuth, async (req, res) => {
  try {
    //get notification_id from the parameters
    const { notification_id } = req.params;
    const staff_id = req.locals.staff_id;

    //check if notification_id exists
    if (!notification_id)
      return res.status(402).send({ message: "Unprocessable request" });

    //update notification from the id
    const updated_notif = await Notification.findOneAndUpdate(
      {
        _id: notification_id,
        "user.staff_id": staff_id,
      },
      {
        unread: false,
      }
    );

    res.send({ message: `notification id: ${updated_notif._id} updated` });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again" });
  }
});

module.exports = route;
