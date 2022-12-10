const form = {
  subject: "",
  service_id: "",
  schedule_date: "",
  body: "",
  hideSignatures: false,
  user: {
    signature: null,
  },
  admin: {
    staff_id: null,
  },
  service_provider: {
    staff_id: null,
  },
  other_service: "",
  options: {},
  reports: {
    status: "created",
  },
};

export default form;
