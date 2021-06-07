const mongoose = require("mongoose");

const Token = new mongoose.Schema({
  creatorID: {
    type: String,
    immutable: true,
    minLength: 7,
    maxLength: 7,
    required: true,
  },
  claimerID: {
    type: String,
    minLength: 7,
    maxLength: 7,
  },
  claimed: {
    type: Boolean,
    required: true,
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
