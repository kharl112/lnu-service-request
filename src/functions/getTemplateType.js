module.exports = (service_id) => {
  return service_id.toString() === "60f62de769f7dd1017e2ba4b"
    ? "mailing"
    : service_id.toString() === "60f62dcb69f7dd1017e2ba49"
    ? "passslip"
    : service_id.toString() === "60f62dd969f7dd1017e2ba4a"
    ? "risograph"
    : service_id.toString() === "60f62e6169f7dd1017e2ba51"
    ? "certification"
    : "original";
};
