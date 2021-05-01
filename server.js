const express = require("express");
const app = express();
const pdf = require("./src/routes/pdf");
const dbconnection = require("./src/db/connection");
require("dotenv").config();

dbconnection();
app.use(express.json());
app.set("views", __dirname + "/public/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public/views"));

app.use("/api/pdf", pdf);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`running on port ${PORT}`));
