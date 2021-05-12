const jwt = require("jsonwebtoken");
const User = require("../db/models/user_model");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send({ message: "access denied" });
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user_found = await User.findById(_id);

    if (!user_found)
      return res.status(400).send({ message: "account not found" });

    req.locals = {
      name: user_found.name,
      email: user_found.email,
      department: user_found.department,
    };

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "invalid session token" });
  }
};

module.exports = userAuth;
