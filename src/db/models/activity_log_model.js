const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const ActivityLog = new mongoose.Schema({
  user: {
    type: Object,
    required: true,
    staff_id: {
      type: String,
      required: true,
    },
    user_type: {
      type: String,
      required: true,
    },
  },
  request_id: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    maxLength: 255,
    required: true,
  },
});

module.exports = mongoose.model("ActivityLog", ActivityLog);
