const route = require("express").Router();

const userAuth = require("../../middlewares/userAuth");
const adminAuth = require("../../middlewares/adminAuth");
const createService = require("../../middlewares/createService");
const requestUsersNotFound = require("../../middlewares/requestUsersNotFound");

const Faculty = require("./controllers/faculty");
const Admin = require("./controllers/admin");
const Provider = require("./controllers/service_provider");
const Track = require("./controllers/track");

route.post(
  "/create",
  userAuth,
  createService,
  requestUsersNotFound,
  Faculty.Mutations.create
);
route.post(
  "/faculty/delete/selected",
  userAuth,
  Faculty.Mutations.delete_drafts
);
route.post(
  "/faculty/update/:_id",
  userAuth,
  createService,
  requestUsersNotFound,
  Faculty.Mutations.update
);
route.post("/faculty/send/:_id", userAuth, Faculty.Mutations.send);
route.post(
  "/faculty/mark/as/complete/:_id",
  userAuth,
  Faculty.Mutations.mark_as_completed
);
route.post(
  "/faculty/mark/as/archive/:_id",
  userAuth,
  Faculty.Mutations.mark_as_archived
);

route.get("/faculty/drafts", userAuth, Faculty.Views.drafts);
route.get("/faculty/sent", userAuth, Faculty.Views.sent);
route.get("/faculty/pendings", userAuth, Faculty.Views.pendings);
route.get("/faculty/completed", userAuth, Faculty.Views.completed);
route.get("/faculty/archives", userAuth, Faculty.Views.archives);
route.get("/faculty/info/:_id", userAuth, Faculty.Views.info);

route.post("/provider/sign", userAuth, Provider.Mutations.sign);

route.get("/provider/pendings", userAuth, Provider.Views.pendings);
route.get("/provider/signed", userAuth, Provider.Views.signed);

route.post("/admin/sign", adminAuth, Admin.Mutations.sign);

route.get("/admin/pendings", adminAuth, Admin.Views.pendings);
route.get("/admin/signed", adminAuth, Admin.Views.signed);
route.get("/admin/archives", adminAuth, Admin.Views.archives);
route.get("/admin/info/:_id", adminAuth, Admin.Views.info);

route.get("/track/:_id", Track.Views.track);

module.exports = route;
