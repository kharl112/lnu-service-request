const mongoose = require("mongoose");

const User = new mongoose.Schema({
  staff_id: {
    type: String,
    required: true,
    immutable: true,
    minLength: 7,
    maxLength: 7,
  },
  name: {
    firstname: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastname: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    middle_initial: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 1,
    },
    prefix: {
      type: String,
      maxLength: 25,
    },
    suffixes: {
      type: Array,
    },
  },
  email: {
    type: String,
    required: true,
    immutable: true,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 255,
  },
  department: {
    unit_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  permitted: {
    type: Boolean,
    required: true,
    default: true
  },
});

module.exports = mongoose.model("User", User);
