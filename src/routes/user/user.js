const route = require("express").Router();
const multer = require("multer");
require("dotenv").config();

const userAuth = require("../../middlewares/userAuth");
const adminAuth = require("../../middlewares/adminAuth");

const Mutations = require("./controllers/mutations");
const Emails = require("./controllers/emails");
const Views = require("./controllers/views");
const GDrive = require("./controllers/google_drive");

const storage = multer.memoryStorage();
const upload = multer({ storage });

route.post("/create", Mutations.create);
route.post("/update", userAuth, Mutations.update);
route.post("/login", Mutations.login);
route.post("/reset/password/:_id_token", Mutations.reset_pass);
route.post("/change/password", userAuth, Mutations.change_pass);
route.post(
  "/drive/upload/files",
  userAuth,
  upload.array("files"),
  GDrive.upload_file
);

route.post("/validate/email", Emails.validate);
route.post("/send/email/link", Emails.send);

route.get("/profile", userAuth, Views.profile);
route.get("/all", adminAuth, Views.all);
route.get("/permitted", adminAuth, Views.permitted);
route.get("/provider/all", userAuth, Views.all_providers);

module.exports = route;
