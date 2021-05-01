const express = require("express");
const app = express();
const pdf = require("./src/routes/pdf");
const PORT = 9000;

app.use(express.json());
app.set("views", __dirname + "/public/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public/views"));


app.use("/api/pdf", pdf);

app.listen(PORT, () => console.log(`running on port ${PORT}`));
