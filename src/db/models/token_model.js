const mongoose = require("mongoose");

const Token = new mongoose.Schema({
  creatorID: {
    type: String,
    min: 24,
    max: 24,
    required: true,
  },
  claimerID: {
    type: String,
    min: 24,
    max: 24,
  },
  claimed: {
    type: Boolean,
    required: true,
  },
  token: {
    type: String,
    min: 9,
    max: 9,
    required: true,
  },
});

module.export = mongoose.model("Token", Token);
