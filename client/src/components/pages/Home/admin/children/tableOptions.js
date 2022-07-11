const tableOptions = (value, text) => ({
  search: "",
  headers: [
    {
      text: "Service Type",
      align: "left",
      sortable: true,
      value: "service[0].type",
    },
    {
      text: "Description",
      align: "left",
      sortable: true,
      value: "subject",
    },
    {
      text: "Requestor Name",
      align: "left",
      sortable: true,
      value: "user.profile",
    },
    {
      text: "Department",
      align: "left",
      sortable: true,
      value: "user.department.unit",
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
