const mongoose = require("mongoose");
require("dotenv").config();
module.exports = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });
  mongoose.connection.once("open", () => {
    console.log("connected to the database");
  });

  mongoose.connection.on(
    "error",
    console.error.bind(console, "connection error:")
  );
};
