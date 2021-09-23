const tableOptions = {
  search: "",
  headers: [
    {
      text: "Description",
      align: "center",
      sortable: false,
      value: "subject",
    },
    {
      text: "Service type",
      align: "center",
      sortable: false,
      value: "service[0].type",
    },
    {
      text: "Date Created",
      align: "center",
      sortable: true,
      value: "date",
    },
    {
      text: "Status",
      align: "center",
      sortable: false,
      value: "status",
    },
    {
      text: "More",
      align: "center",
      sortable: false,
      value: "_id",
    },
  ],
};

export default tableOptions;
