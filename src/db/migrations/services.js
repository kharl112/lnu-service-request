const Service = require("../models/service_model");
const migrate = async () => {
  const services = [
    {
      _id: "62d7f8f2d6d6d829a8107a4e",
      paper_size: "A4",
      type: "Pass Slip",
      component: "PassSlip",
      options: { name: "", timeout: "", date: "" },
    },
    {
      _id: "62d7fb8f6ca91b2b7f7f9e80",
      paper_size: "A4",
      type: "Job Order For Risograph",
      component: "Risograph",
      options: {
        with_paper: false,
        back_to_back: false,
        documents: [{ title: "", copies: 0, pages: 0, produced: 0 }],
      },
    },
    {
      _id: "62d7fdddbfdaeb2e03878dcb",
      paper_size: "A4",
      type: "Request For Services",
      component: "RequestForServices",
      options: { persons_involved: [], type: "" },
    },
    {
      _id: "62d7ff720144e63075a27c82",
      paper_size: "A4",
      type: "Certification",
      component: "Certification",
      options: {
        co_makers: [],
        request_for: { accounting: "", records: "" },
        purpose: "",
      },
    },
  ];

  await Service.insertMany(services, { ordered: false });
};

module.exports = { migrate };
