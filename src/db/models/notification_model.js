const mongoose = require("mongoose");

const Notification = new mongoose.Schema({
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
  initiator: {
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
  unread: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model("Notification", Notification);
