const tableOptions = (value, text) => ({
  search: "",
  headers: [
    {
      text: "Requestor Name",
      align: "left",
      sortable: true,
      value: "user.profile",
    },
    {
      text: "Position/Role",
      align: "left",
      sortable: true,
      value: "user.department.role",
    },
    {
      text: "Department",
      align: "left",
      sortable: true,
      value: "user.department.unit",
    },
    {
      text: "Service type",
      align: "left",
      sortable: true,
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
