const mongoose = require("mongoose");
require("dotenv").config();
module.exports = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });

  return mongoose.connection.once("open", () => {
    console.log("connected to the database");
  });
};
