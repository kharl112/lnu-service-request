const changeServices = (id) => {
  const services = [
    { id: "60f62dcb69f7dd1017e2ba49", obj: { name: "", timeout: "" } },
    {
      id: "60f62dd969f7dd1017e2ba4a",
      obj: {
        with_paper: false,
        back_to_back: false,
        documents: [],
      },
    },
    {
      id: "60f62e6169f7dd1017e2ba51",
      obj: {
        co_maker: [],
        request_for: "",
        purpose: "",
      },
    },
    {
      id: "60f62de769f7dd1017e2ba4b",
      obj: {
        postal: "",
        type: "",
        recipient: "",
        released_by: "",
        released_date: "",
      },
    },
  ];

  const [selected] = services.filter((service) => service.id === id);

  return selected || { persons_involved: [] };
};

export default changeServices;
