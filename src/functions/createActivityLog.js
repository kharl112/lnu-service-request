const ActivityLog = require("../db/models/activity_log_model");

module.exports = async (options) => {
  try {
    //instanciate ActivityLog
    const activity = new ActivityLog(options);
    //Create new activity log
    const created_activity = await activity.save();
    //return newly created activity log
    return created_activity;
  } catch (error) {
    //return if error
    throw error;
  }
};
