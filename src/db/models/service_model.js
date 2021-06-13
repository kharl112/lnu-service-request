const mongoose = require("mongoose");

const Service = new mongoose.Schema({
  type: {
    type: String,
    maxLength: 255,
    required: true,
  },
});

module.exports = mongoose.model("Service", Service);
