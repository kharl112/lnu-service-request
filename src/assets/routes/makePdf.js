const route = require("express").Router();
const pdf = require("html-pdf");
const path = require("path");
const pug = require("pug");

route.post("/create", async (req, res) => {
  const { form, options } = req.body;
  try {
    const link = `file://${path.join(__dirname + "/../../../public/views/")}`;

    const [imagelink, csslink] = [
      link + "images/logo.png",
      link + "styles/template1.css",
    ];
    
    const html = pug.renderFile(
      path.join(__dirname + "/../../../public/views/template1.pug"),
      {
        imagelink,
        csslink,
        form,
      }
    );
    const success = await pdf
      .create(html, options)
      .toFile("./src/assets/routes/temp/response.pdf", (e) => e);

    return res.sendFile(path.join(__dirname + "/temp/response.pdf"));
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

module.exports = route;
