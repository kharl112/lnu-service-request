const mongoose = require("mongoose");

const ActivityLog = new mongoose.Schema({
  _id: {
    type: String,
    default: nanoid(9),
  },
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
  request: {
    _id: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
    maxLength: 255,
    required: true,
  },
});

module.exports = mongoose.model("ActivityLog", ActivityLog);
