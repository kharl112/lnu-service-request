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
      text: "Service Type",
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
