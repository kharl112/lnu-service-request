const Notification = require("../db/models/notification_model");
const pusher = require("./pusher");

module.exports = async (options) => {
  try {

    //options
    // {
    //   user: { staff_id, user_type}
    //   action_type,
    //   request_id,
    //   initiator,
    //   description,
    // }

    pusher.trigger(options.user.staff_id, options.action_type, {
      request_id: options.request_id,
      initiator: options.initiator,
      user_type: options.user.user_type,
      message: options.description,
      date: new Date(),
    });

    //instanciate notification model
    const notification = new Notification(options);
    //Create new notification
    const created_notification = await notification.save();
    //return newly created notification
    return created_notification;
  } catch (error) {
    //return if error
    throw error;
  }
};
