const route = require("express").Router();
const multer = require("multer");
require("dotenv").config();

const adminAuth = require("../../middlewares/adminAuth");
const userAuth = require("../../middlewares/userAuth");

const Mutations = require("./controllers/mutations");
const Emails = require("./controllers/emails");
const GDrive = require("./controllers/google_drive");
const Views = require("./controllers/views");

const storage = multer.memoryStorage();
const upload = multer({ storage });

route.post("/create", Mutations.create);
route.post("/update", adminAuth, Mutations.update);
route.post("/login", Mutations.login);
route.post("/reset/password/:_id_token", Mutations.reset_pass);
route.post("/change/password", adminAuth, Mutations.change_pass);
route.post(
  "/drive/upload/file",
  adminAuth,
  upload.single("file"),
  GDrive.upload_file
);

route.post("/validate/email", Emails.validate);
route.post("/send/email/link", Emails.send);

route.get("/profile", adminAuth, Views.profile);
route.get("/all", userAuth, Views.all);

module.exports = route;
