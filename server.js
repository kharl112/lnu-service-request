const express = require("express");
const app = express();
const makePdfRoute = require("./src/assets/routes/makePdf");
const path = require("path");
const PORT = 8080;

app.use(express.json());
app.set("views", __dirname + "/public/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public/views"));
app.get("/", (req, res) =>
  res.render("template1", { title: "Hey", message: "Hello there!" })
);

app.use("/api/pdf", makePdfRoute);

app.listen(PORT, () => console.log(`running on port ${PORT}`));
