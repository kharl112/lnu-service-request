const mongoose = require("mongoose");

const Role = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 255,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 2,
  },
});

module.exports = mongoose.model("Role", Role);
