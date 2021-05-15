const jwt = require("jsonwebtoken");
const User = require("../db/models/user_model");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send({ message: "access denied" });
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const user_found = await User.findById(_id).select({
      _id: 0,
      password: 0,
      __v: 0,
    });

    if (!user_found)
      return res.status(404).send({ message: "account not found" });

    if (!user_found.permitted)
      return res.status(400).send({ message: "account not permitted" });

    req.locals = user_found;

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "invalid session token" });
  }
};

module.exports = userAuth;
