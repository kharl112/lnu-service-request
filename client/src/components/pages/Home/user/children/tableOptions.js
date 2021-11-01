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
      value: "reports.dates.created",
    },
    {
      text: "Status",
      align: "center",
      sortable: true,
      value: "reports.status",
    },
  ],
};

export default tableOptions;
