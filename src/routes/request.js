const route = require("express").Router();
const { create, deleteSelected } = require("../validation/request_validation");

const userAuth = require("../authentication/userAuth");
const adminAuth = require("../authentication/adminAuth");

const User = require("../db/models/user_model");
const Admin = require("../db/models/admin_model");
const Request = require("../db/models/request_model");
const requestQuery = require("../functions/requestQuery");

route.post("/create", userAuth, async (req, res) => {
  req.body.status = 0;

  const { error } = create(req.body);
  if (error) return res.status(400).send(error.details[0]);

  const admin_found = await Admin.findOne({
    staff_id: req.body.admin.staff_id,
    permitted: true,
  });
  if (!admin_found) return res.status(400).send({ message: "admin not found" });

  if (req.body.service_provider.staff_id) {
    const service_provider_found = await User.findOne({
      staff_id: req.body.service_provider.staff_id,
      permitted: true,
    });
    if (!service_provider_found)
      return res.status(400).send({ message: "service provider not found" });
  }

  const request = new Request({
    ...req.body,
    user: { staff_id: req.locals.staff_id, ...req.body.user },
  });

  try {
    await request.save();
    return res.send({
      message: `request ${req.body.save_as === 0 ? "saved as draft" : "sent"}`,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.post("/faculty/draft/delete/selected", userAuth, async (req, res) => {
  const { error } = deleteSelected(req.body);
  if (error) return res.status(400).send(error.details[0]);

  delete req.body.status;

  await Request.find({
    "user.staff_id": req.locals.staff_id,
    _id: { $in: req.body.selected },
  }).deleteMany({}, (error) => {
    if (error)
      return res
        .status(500)
        .send({ message: "something went wrong, please try again." });
    return res.send({ message: "selected requests deleted" });
  });
});

route.get("/faculty/draft", userAuth, async (req, res) => {
  const faculty_drafts = await Request.aggregate(
    requestQuery({
      "user.staff_id": req.locals.staff_id,
      save_as: 0,
    })
  );
  return res.send(faculty_drafts);
});

route.get("/faculty/sent/all", userAuth, async (req, res) => {
  const faculty_sent = await Request.aggregate(
    requestQuery({
      "user.staff_id": req.locals.staff_id,
      save_as: 1,
      status: { $ne: 2 },
    })
  );
  return res.send(faculty_sent);
});

route.get("/faculty/sent/pending", userAuth, async (req, res) => {
  const faculty_sent = await Request.aggregate(
    requestQuery({
      "user.staff_id": req.locals.staff_id,
      save_as: 1,
      status: 0,
    })
  );
  return res.send(faculty_sent);
});

route.get("/faculty/sent/completed", userAuth, async (req, res) => {
  const faculty_sent = await Request.aggregate(
    requestQuery({
      "user.staff_id": req.locals.staff_id,
      save_as: 1,
      status: 1,
    })
  );
  return res.send(faculty_sent);
});

route.get("/faculty/sent/archived", userAuth, async (req, res) => {
  const faculty_sent = await Request.aggregate(
    requestQuery({
      "user.staff_id": req.locals.staff_id,
      save_as: 1,
      status: 2,
    })
  );
  return res.send(faculty_sent);
});

route.get("/faculty/letter=:id", userAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const form = await Request.findOne({
      _id: id,
      "user.staff_id": req.locals.staff_id,
      save_as: 0,
    }).select({ _id: 0, __v: 0, date: 0, "user.staff_id": 0 });

    return res.send({ form });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "something went wrong, please try again." });
  }
});

route.get("/provider/pending", userAuth, async (req, res) => {
  const service_provider_pending = await Request.aggregate(
    requestQuery({
      "service_provider.staff_id": req.locals.staff_id,
      "admin.signature": { $ne: "" },
      "service_provider.signature": "",
      save_as: 1,
    })
  );
  return res.send(service_provider_pending);
});

route.get("/provider/signed", userAuth, async (req, res) => {
  const service_provider_signed = await Request.aggregate(
    requestQuery({
      "service_provider.staff_id": req.locals.staff_id,
      "admin.signature": { $ne: "" },
      "service_provider.signature": { $ne: "" },
      save_as: 1,
    })
  );
  return res.send(service_provider_signed);
});

route.post("/provider/sign", userAuth, async (req, res) => {
  if (req.locals.department.role_id === 1)
    return res.status(401).send({ message: "invalid user type" });

  await Request.findByIdAndUpdate(
    req.body.request_id,
    {
      "service_provider.signature": req.body.signature,
    },
    {},
    (error) => {
      if (error)
        return res
          .status(500)
          .send({ message: "something went wrong, please try again." });
      return res.send({ message: "signing complete" });
    }
  );
});

route.get("/admin/pending", adminAuth, async (req, res) => {
  const admin_pending = await Request.aggregate(
    requestQuery({
      "admin.staff_id": req.locals.staff_id,
      "user.signature": { $ne: "" },
      "admin.signature": "",
      save_as: 1,
    })
  );
  return res.send(admin_pending);
});

route.get("/admin/signed", adminAuth, async (req, res) => {
  const admin_signed = await Request.aggregate(
    requestQuery({
      "admin.staff_id": req.locals.staff_id,
      "user.signature": { $ne: "" },
      "admin.signature": { $ne: "" },
      save_as: 1,
    })
  );
  return res.send(admin_signed);
});

route.get("/track/:_id", adminAuth, async (req, res) => {
  const { _id } = req.param;
  if (!_id) return res.status(500).send({ message: "empty parameter" });

  const [tracked_request] = await Request.aggregate(
    requestQuery({
      _id: req.locals.staff_id,
      "user.signature": { $ne: "" },
      save_as: 1,
    })
  );
  
  return res.send(tracked_request);
});

route.post("/admin/sign", adminAuth, async (req, res) => {
  await Request.findByIdAndUpdate(
    req.body.request_id,
    {
      "admin.signature": req.body.signature,
    },
    {},
    (error) => {
      if (error)
        return res
          .status(500)
          .send({ message: "something went wrong, please try again." });
      return res.send({ message: "signing complete" });
    }
  );
});

route.post("/faculty/update/letter=:_id", userAuth, async (req, res) => {
  const { _id } = req.params;
  if (!_id) return res.status(400).send({ message: "empty parameter" });

  const { error } = create(req.body.form);

  if (error) return res.status(400).send(error.details[0]);
  req.body.form.user.staff_id = req.locals.staff_id;

  await Request.findByIdAndUpdate(_id, req.body.form, {}, (error) => {
    if (error)
      return res
        .status(500)
        .send({ message: "something went wrong, please try again" });
    return res.send({ message: "request letter updated" });
  });
});

route.post("/faculty/send/letter=:_id", userAuth, async (req, res) => {
  const { _id } = req.params;
  if (!_id) return res.status(400).send({ message: "empty parameter" });

  await Request.findByIdAndUpdate(_id, { save_as: 1 }, {}, (error) => {
    if (error)
      return res
        .status(500)
        .send({ message: "something went wrong, please try again" });
    return res.send({ message: "request letter sent" });
  });
});

route.post("/mark/complete/letter=:_id", userAuth, async (req, res) => {
  const { _id } = req.params;
  if (!_id) return res.status(400).send({ message: "empty parameter" });

  await Request.findOneAndUpdate(
    { _id: _id, "service_provider.staff_id": req.locals.staff_id },
    { status: 1 },
    {},
    (error) => {
      if (error)
        return res
          .status(500)
          .send({ message: "something went wrong, please try again" });
      return res.send({ message: "request letter marked as completed" });
    }
  );
});

route.post("/mark/archive/letter=:_id", userAuth, async (req, res) => {
  const { _id } = req.params;
  if (!_id) return res.status(400).send({ message: "empty parameter" });

  await Request.findOneAndUpdate(
    { _id: _id, "user.staff_id": req.locals.staff_id },
    { status: 2 },
    {},
    (error) => {
      if (error)
        return res
          .status(500)
          .send({ message: "something went wrong, please try again" });
      return res.send({ message: "request letter marked as completed" });
    }
  );
});

module.exports = route;
