const express = require("express");
const app = express();
const pdf = require("./src/routes/pdf");
const admin = require("./src/routes/admin");
const user = require("./src/routes/user");
const token = require("./src/routes/token");
const request = require("./src/routes/request");
const dbconnection = require("./src/db/connection");
require("dotenv").config();

dbconnection();
app.use(express.json());
app.set("views", __dirname + "/public/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public/views"));

app.use("/api/pdf", pdf);
app.use("/api/admin", admin);
app.use("/api/user", user);
app.use("/api/token", token);
app.use("/api/request/", request);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`running on port ${PORT}`));
