const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const Request = new mongoose.Schema({
  _id: {
    type: String,
    default: nanoid(9),
  },
  subject: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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
  service_provider: {
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
  status: {
    type: Number,
    required: true,
    min: 0,
    max: 2,
  },
});

module.exports = mongoose.model("Request", Request);
