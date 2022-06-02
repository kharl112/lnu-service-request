const tableOptions = (value, text) => ({
  search: "",
  headers: [
    {
      text: "Requestor Name",
      align: "left",
      sortable: false,
      value: "user.profile",
    },
    {
      text: "Service type",
      align: "left",
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
      align: "left",
      sortable: true,
      value: "reports.status",
    },
  ],
});

export default tableOptions;
