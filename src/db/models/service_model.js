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
  paper_size: {
    type: String,
    required: true,
    default: "Letter"
  },
  options: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Service", Service);
