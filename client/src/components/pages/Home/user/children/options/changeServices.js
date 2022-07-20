const changeServices = (id) => {
  const services = [
    {
      id: "62d7f8f2d6d6d829a8107a4e",
      obj: { name: "", timeout: "", date: "" },
    },
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
        co_makers: [],
        request_for: {
          accounting: "",
          records: "",
        },
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
    {
      id: "617e687287cd8b37a31133dc",
      obj: {
        liters: 0,
        issue_to: "",
        amount: 0,
        type: "Credit",
      },
    },
    {
      id: "6289b551a3c6361acbe41a66",
      obj: {
        location: "",
        incident_date: "",
        incident_time: "",
        reviewed_by: "",
        remarks: "",
      },
    },
    {
      id: "6289f4829d7eb32a7b74035c",
      obj: {
        passers: [],
        duration: "",
        use_date: "",
        location: "",
        security_name: "",
      },
    },
    {
      id: "629c8b230db34e279582a537",
      obj: {
        persons_involved: [],
        type: "",
      },
    },
  ];

  const [selected] = services.filter((service) => service.id === id);

  return selected ? selected.obj : { persons_involved: [] };
};

export default changeServices;
