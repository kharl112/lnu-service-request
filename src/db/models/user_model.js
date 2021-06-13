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
    minLength: 8,
    maxLength: 255,
  },
  department: {
    unit_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      minLength: 24,
      maxLength: 24,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      minLength: 24,
      maxLength: 24,
    },
  },
  permitted: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", User);
