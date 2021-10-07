const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const pug = require("pug");
const path = require("path");
require("dotenv").config();

const User = require("../../../db/models/user_model");
const Admin = require("../../../db/models/admin_model");

const generateEmail = require("../../../functions/generateEmail");

module.exports = (() => {
  const validate = async (req, res) => {
    const user_email_found = await User.findOne({ email: req.body.email });
    const admin_email_found = await Admin.findOne({ email: req.body.email });

    if (user_email_found || admin_email_found)
      return res.status(400).send({ message: "this email already exists" });

    return res.send({ email: req.body.email });
  };

  const send = async (req, res) => {
    const email_found = await User.findOne({ email: req.body.email });
    if (!email_found)
      return res.status(400).send({ message: "email not found" });

    const token = jwt.sign(
      { _id: email_found._id },
      process.env.PASSWORD_RESET,
      {
        expiresIn: "1h",
      }
    );

    const mail = nodemailer.createTransport(generateEmail.transport);

    try {
      const html = pug.renderFile(
        path.join(__dirname + "../../../../../public/views/reset_password.pug"),
        {
          form: {
            link: `https://lnusr.herokuapp.com/faculty/forgot/password/reset/${token}`,
            firstname: email_found.name.firstname,
          },
        }
      );

      await mail.sendMail(
        generateEmail.options(
          email_found.email,
          "Account retrieval",
          html.toString()
        )
      );
      return res.send({ message: "email sent" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "we can't process your request, please try again." });
    }
  };

  return { validate, send };
})();
