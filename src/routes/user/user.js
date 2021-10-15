const route = require("express").Router();
const multer = require("multer");
require("dotenv").config();

const userAuth = require("../../authentication/userAuth");
const adminAuth = require("../../authentication/adminAuth");

const Mutations = require("./controllers/mutations");
const Emails = require("./controllers/emails");
const Views = require("./controllers/views");
const GDrive = require("./controllers/google_drive");

const storage = multer.memoryStorage();
const upload = multer({ storage });

route.post("/create", (req, res) => Mutations.create(req, res));
route.post("/update", userAuth, (req, res) => Mutations.update(req, res));
route.post("/login", (req, res) => Mutations.login(req, res));
route.post("/reset/password/:_id_token", (req, res) =>
  Mutations.reset_pass(req, res)
);
route.post("/change/password", userAuth, (req, res) =>
  Mutations.change_pass(req, res)
);
route.post("/drive/upload/file", userAuth, upload.single("file"), (req, res) =>
  GDrive.upload_file(req, res)
);

route.post("/validate/email", (req, res) => Emails.validate(req, res));
route.post("/send/email/link", (req, res) => Emails.send(req, res));

route.get("/profile", userAuth, (req, res) => Views.profile(req, res));
route.get("/all", adminAuth, (req, res) => Views.all(req, res));
route.get("/permitted", adminAuth, (req, res) => Views.permitted(req, res));
route.get("/provider/all", userAuth, (req, res) =>
  Views.all_providers(req, res)
);

module.exports = route;
