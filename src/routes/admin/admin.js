const route = require("express").Router();
const multer = require("multer");
require("dotenv").config();

const adminAuth = require("../../authentication/adminAuth");
const userAuth = require("../../authentication/userAuth");

const Mutations = require("./controllers/mutations");
const Emails = require("./controllers/emails");
const GDrive = require("./controllers/google_drive");
const Views = require("./controllers/views");

const storage = multer.memoryStorage();
const upload = multer({ storage });

route.post("/create", (req, res) => Mutations.create(req, res));
route.post("/update", adminAuth, (req, res) => Mutations.update(req, res));
route.post("/login", (req, res) => Mutations.login(req, res));
route.post("/reset/password/:_id_token", (req, res) =>
  Mutations.reset_pass(req, res)
);
route.post("/change/password", adminAuth, (req, res) =>
  Mutations.change_pass(req, res)
);
route.post("/drive/upload/file", adminAuth, upload.single("file"), (req, res) =>
  GDrive.upload_file(req, res)
);

route.post("/validate/email", (req, res) => Emails.validate(req, res));
route.post("/send/email/link", (req, res) => Emails.send(req, res));

route.get("/profile", adminAuth, (req, res) => Views.profile(req, res));
route.get("/all", userAuth, (req, res) => Views.all(req, res));

module.exports = route;
