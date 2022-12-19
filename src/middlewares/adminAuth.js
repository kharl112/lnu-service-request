const jwt = require("jsonwebtoken");
const Admin = require("../db/models/admin_model");
require("dotenv").config();

const adminAuth = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send({ message: "access denied" });
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const admin_found = await Admin.findById(_id).select({
      _id: 0,
      password: 0,
      __v: 0,
    });

    if (!admin_found)
      return res.status(400).send({ message: "account not found" });

    if (!admin_found.permitted)
      return res.status(401).send({ message: "account is not permitted" });

    req.locals = admin_found;

    next();
  } catch (error) {
    return res.status(400).send({ message: "invalid session token" });
  }
};

module.exports = adminAuth;
