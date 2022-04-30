const mongoose = require("mongoose");

const Unit = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 255,
    required: true,
  },
});

module.exports = mongoose.model("Unit", Unit);
