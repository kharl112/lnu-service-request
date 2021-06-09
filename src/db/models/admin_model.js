const mongoose = require("mongoose");

const Admin = new mongoose.Schema({
  staff_id: {
    type: String,
    required: true,
    immutable: true,
    minLength: 2,
    maxLength: 255,
  },
  name: {
    firstname: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    lastname: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    middle_initial: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 1,
    },
    prefix: {
      type: String,
      maxLength: 255,
    },
    suffixes: {
      type: Array,
    },
  },
  email: {
    type: String,
    required: true,
    immutable: true,
    maxLength: 255,
  },
  password: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  permitted: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Admin", Admin);
