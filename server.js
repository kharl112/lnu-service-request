const express = require("express");
const app = express();
const path = require("path");
const pdf = require("./src/routes/pdf");
const admin = require("./src/routes/admin/admin");
const user = require("./src/routes/user");
const token = require("./src/routes/token");
const request = require("./src/routes/request");
const unit = require("./src/routes/unit");
const role = require("./src/routes/role");
const service = require("./src/routes/service");
const dbconnection = require("./src/db/connection");
require("dotenv").config();

app.use(express.json());
app.set("views", __dirname + "/public/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public/views"));

app.use("/api/pdf", pdf);
app.use("/api/admin", admin);
app.use("/api/user", user);
app.use("/api/token", token);
app.use("/api/request", request);
app.use("/api/unit", unit);
app.use("/api/role", role);
app.use("/api/service", service);

app.use(express.static("client/dist"));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
dbconnection().then(() =>
  app.listen(PORT, () => console.log(`running on port ${PORT}`))
);
