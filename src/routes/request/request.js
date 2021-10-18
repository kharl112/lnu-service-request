const route = require("express").Router();

const userAuth = require("../../middlewares/userAuth");
const adminAuth = require("../../middlewares/adminAuth");

const Faculty = require("./controllers/faculty");
const Admin = require("./controllers/admin");
const Provider = require("./controllers/service_provider");
const Track = require("./controllers/track");

route.post("/create", userAuth, (req, res) =>
  Faculty.Mutations.create(req, res)
);
route.post("/faculty/draft/delete/selected", userAuth, (req, res) =>
  Faculty.Mutations.delete_drafts(req, res)
);
route.post("/faculty/update/letter=:_id", userAuth, (req, res) =>
  Faculty.Mutations.update(req, res)
);
route.post("/faculty/send/letter=:_id", userAuth, (req, res) =>
  Faculty.Mutations.send(req, res)
);
route.post("/mark/complete/letter=:_id", userAuth, (req, res) =>
  Faculty.Mutations.mark_completed(req, res)
);
route.post("/mark/archive/letter=:_id", userAuth, (req, res) =>
  Faculty.Mutations.mark_archived(req, res)
);

route.get("/faculty/draft", userAuth, (req, res) =>
  Faculty.Views.drafts(req, res)
);
route.get("/faculty/sent/all", userAuth, (req, res) =>
  Faculty.Views.sents(req, res)
);
route.get("/faculty/sent/pending", userAuth, (req, res) =>
  Faculty.Views.pendings(req, res)
);
route.get("/faculty/sent/completed", userAuth, (req, res) =>
  Faculty.Views.completeds(req, res)
);
route.get("/faculty/sent/archived", userAuth, (req, res) =>
  Faculty.Views.archiveds(req, res)
);
route.get("/faculty/letter=:id", userAuth, (req, res) =>
  Faculty.Views.info(req, res)
);

route.post("/provider/sign", userAuth, (req, res) =>
  Provider.Mutations.sign(req, res)
);
route.get("/provider/pending", userAuth, (req, res) =>
  Provider.Views.pendings(req, res)
);
route.get("/provider/signed", userAuth, (req, res) =>
  Provider.Views.signeds(req, res)
);

route.post("/admin/sign", adminAuth, (req, res) =>
  Admin.Mutations.sign(req, res)
);

route.get("/admin/pending", adminAuth, (req, res) =>
  Admin.Views.pendings(req, res)
);
route.get("/admin/signed", adminAuth, (req, res) =>
  Admin.Views.signeds(req, res)
);
route.get("/admin/sent/archived", adminAuth, (req, res) =>
  Admin.Views.archiveds(req, res)
);

route.get("/track/:_id", (req, res) => Track.Views.track(req, res));

module.exports = route;
