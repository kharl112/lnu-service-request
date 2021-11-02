const tableOptions = (value, text) => ({
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
      text,
      align: "center",
      sortable: true,
      value,
    },
    {
      text: "Status",
      align: "center",
      sortable: true,
      value: "reports.status",
    },
  ],
});

export default tableOptions;
