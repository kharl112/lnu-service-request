const mongoose = require("mongoose");

const Service = new mongoose.Schema({
  type: {
    type: String,
    maxLength: 255,
    required: true,
  },
  component: {
    type: String,
    maxLength: 255,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Service", Service);
