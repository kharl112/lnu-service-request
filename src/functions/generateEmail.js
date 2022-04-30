require("dotenv").config();

const generateEmail = (() => {
  const transport = {
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.SR_EMAIL,
      pass: process.env.SR_PASSWORD,
    },
  };

  const options = (email, subject, html) => ({
    from: process.env.SR_EMAIL,
    to: email,
    subject: subject,
    html: html,
  });
  return { transport, options };
})();

module.exports = generateEmail;
