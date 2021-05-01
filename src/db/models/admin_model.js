const mongoose = require("mongoose");

const Admin = new mongoose.Schema({
  staff_id: {
    type: String,
    required: true,
    max: 11,
  },
  name: {
    type: String,
    required: true,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 255,
  },
  permitted: {
    type: Boolean,
    require: true,
  },
});

module.exports = mongoose.model("Admin", Admin);
