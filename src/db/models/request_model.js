const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const Request = new mongoose.Schema({
  _id: {
    type: String,
    default: nanoid(9),
  },
  hideSignatures: {
    type: Boolean,
    default: false,
  },
  subject: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  body: {
    type: String,
    required: true,
    min: 10,
  },
  options: {
    type: Object,
    required: true,
  },
  service_provider: {
    type: Object,
    required: true,
    staff_id: {
      type: String,
      required: false,
      default: null,
    },
    signature: {
      type: String,
      required: false,
      default: null,
    },
    reports: {
      type: Object,
      required: true,
      date: {
        type: Date,
        required: false,
        default: null,
      },
      remarks: {
        type: String,
        required: false,
        default: null,
      },
    },
  },
  admin: {
    type: Object,
    required: true,
    staff_id: {
      type: String,
      required: false,
    },
    signature: {
      type: String,
      required: false,
      default: null,
    },
    reports: {
      type: Object,
      required: true,
      date: {
        type: Date,
        required: false,
        default: null,
      },
      remarks: {
        type: String,
        required: false,
        default: null,
      },
    },
  },
  user: {
    type: Object,
    required: true,
    staff_id: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
  },
  reports: {
    type: Object,
    required: true,
    status: {
      type: String,
      required: true,
      default: "created",
    },
    dates: {
      type: Object,
      required: true,
      created: {
        type: Date,
        required: false,
        default: Date.now,
      },
      sent: {
        type: Date,
        required: false,
        default: null,
      },
      completed: {
        type: Date,
        required: false,
        default: null,
      },
      archived: {
        type: Date,
        required: false,
        default: null,
      },
    },
  },
});

module.exports = mongoose.model("Request", Request);
