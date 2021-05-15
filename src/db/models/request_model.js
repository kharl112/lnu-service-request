const mongoose = require("mongoose");

const Request = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
  greetings: {
    type: String,
    required: true,
    min: 5,
    max: 100,
  },
  body: {
    type: String,
    required: true,
    min: 10,
  },
  options: {
    type: Object,
    required: true,
  },
  head: {
    type: Object,
    required: true,
    staff_id: {
      type: String,
      required: false,
    },
    signature: {
      type: String,
      required: false,
    },
  },
  admin: {
    type: Object,
    required: true,
    staff_id: {
      type: String,
      required: false,
    },
    signature: {
      type: String,
      required: false,
    },
  },
  user: {
    type: Object,
    required: true,
    staff_id: {
      type: String,
      required: false,
    },
    signature: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    default: new Date(),
    required: true,
  },
  save_as: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
});

module.exports = mongoose.model("Request", Request);
