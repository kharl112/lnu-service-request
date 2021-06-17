const mongoose = require("mongoose");

const Token = new mongoose.Schema({
  claimer_staff_id: {
    type: String,
    required: true,
    immutable: true,
    minLength: 7,
    maxLength: 7,
  },
  token: {
    type: String,
    required: true,
    immutable: true,
    minLength: 9,
    maxLength: 9,
  },
});

module.exports = mongoose.model("Token", Token);
