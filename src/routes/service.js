const route = require("express").Router();
const Service = require("../db/models/service_model");

route.get("/all", async (req, res) => {
  try {
    const valid_services = [
      "62d7f8f2d6d6d829a8107a4e",
      "62d7fb8f6ca91b2b7f7f9e80",
      "62d7fdddbfdaeb2e03878dcb",

      "60f62dd969f7dd1017e2ba4a",
      "60f62e6169f7dd1017e2ba51",
      "629c8b230db34e279582a537"
    ];

    const all_services = await Service.find({
      $or: [
        ...valid_services.map((id) => ({
          _id: id,
        })),
      ],
    });
    return res.send(all_services);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong please try again" });
  }
});

module.exports = route;
