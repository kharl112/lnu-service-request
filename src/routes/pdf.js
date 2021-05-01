const route = require("express").Router();
const pdf = require("html-pdf");
const path = require("path");
const pug = require("pug");

route.post("/create", async (req, res) => {
  const { form, options } = req.body;
  try {
    const link = `file://${path.join(__dirname + "/../../public/views/")}`;
    const html = pug.renderFile(
      path.join(__dirname + "/../../public/views/template1.pug"),
      { link, form }
    );
    
    return await pdf.create(html, options).toBuffer((e, buffer) => {
      return res.send(buffer);
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

module.exports = route;
