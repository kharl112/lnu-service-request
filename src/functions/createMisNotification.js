const MISNotification = require("../db/models/mis_notification_model");
const pusher = require("./pusher");
require("dotenv").config();

module.exports = async (options) => {

  try {
    options.date = new Date();
    pusher.trigger(process.env.CHANNEL, "notify", options);

    //instanciate notification model
    const notification = new MISNotification(options);
    //Create new notification
    const created_notification = await notification.save();
    //return newly created notification
    return created_notification;
  } catch (error) {
    //return if error
    throw error;
  }
};
