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
  ],
};

export default tableOptions;
