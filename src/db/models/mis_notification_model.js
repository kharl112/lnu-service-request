const mongoose = require("mongoose");

const MISNotification = new mongoose.Schema({
  initiator: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: false,
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
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

module.exports = mongoose.model("MISNotification", MISNotification);
