const mongoose = require("mongoose");

const Admin = new mongoose.Schema({
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
    middle_initial: {
      type: String,
      required: true,
      min: 1,
      max: 1,
    },
    prefix: {
      type: String,
      min: 1,
      max: 255,
    },
    suffixes: {
      type: Array,
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
  signature: {
    type: Object,
    required: false,
  },
  permitted: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Admin", Admin);
