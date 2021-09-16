module.exports = (service_id) => {
  return service_id.toString() === "60f62de769f7dd1017e2ba4b"
    ? "mailing"
    : form.service_id.toString() === "60f62dcb69f7dd1017e2ba49"
    ? "passslip"
    : form.service_id.toString() === "60f62dd969f7dd1017e2ba4a"
    ? "risograph"
    : "original";
};
