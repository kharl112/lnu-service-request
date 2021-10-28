const route = require("express").Router();

const userAuth = require("../../middlewares/userAuth");
const adminAuth = require("../../middlewares/adminAuth");

const Faculty = require("./controllers/faculty");
const Admin = require("./controllers/admin");
const Provider = require("./controllers/service_provider");
const Track = require("./controllers/track");

route.post("/create", userAuth, Faculty.Mutations.create);
route.post(
  "/faculty/draft/delete/selected",
  userAuth,
  Faculty.Mutations.delete_drafts
);
route.post("/faculty/update/letter=:_id", userAuth, Faculty.Mutations.update);
route.post("/faculty/send/letter=:_id", userAuth, Faculty.Mutations.send);
route.post(
  "/mark/complete/letter=:_id",
  userAuth,
  Faculty.Mutations.mark_completed
);
route.post(
  "/mark/archive/letter=:_id",
  userAuth,
  Faculty.Mutations.mark_archived
);

route.get("/faculty/draft", userAuth, Faculty.Views.drafts);
route.get("/faculty/sent/all", userAuth, Faculty.Views.sents);
route.get("/faculty/sent/pending", userAuth, Faculty.Views.pendings);
route.get("/faculty/sent/completed", userAuth, Faculty.Views.completeds);
route.get("/faculty/sent/archived", userAuth, Faculty.Views.archiveds);
route.get("/faculty/letter=:id", userAuth, Faculty.Views.info);

route.post("/provider/sign", userAuth, Provider.Mutations.sign);
route.get("/provider/pending", userAuth, Provider.Views.pendings);
route.get("/provider/signed", userAuth, Provider.Views.signeds);

route.post("/admin/sign", adminAuth, Admin.Mutations.sign);

route.get("/admin/pending", adminAuth, Admin.Views.pendings);
route.get("/admin/signed", adminAuth, Admin.Views.signeds);
route.get("/admin/sent/archived", adminAuth, Admin.Views.archiveds);
route.get("/admin/letter=:id", adminAuth, Admin.Views.info);

route.get("/track/:_id", Track.Views.track);

module.exports = route;
