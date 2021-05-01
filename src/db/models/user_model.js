const mongoose = require("mongoose");

const User = new mongoose.Schema({
  staff_id: {
    type: String,
    required: true,
    min: 11,
    max: 11,
  },
  name: {
    type: Object,
    required: true,
    firstname: {
      type: String,
      required: true,
      min: 2,
      max: 255,
    },
    lastname: {
      type: String,
      required: true,
      min: 2,
      max: 255,
    },
    middlename: {
      type: String,
      required: true,
      min: 2,
      max: 255,
    },
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
  department: {
    type: Object,
    required: true,
    name: {
      type: String,
      required: true,
      min: 2,
      max: 255,
    },
  },
  signature_url: {
    type: String,
  },
});

module.exports = mongoose.model("User", User);
