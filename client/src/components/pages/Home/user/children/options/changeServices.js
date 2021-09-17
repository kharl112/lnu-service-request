const changeServices = (value) =>
  value === "60f62dcb69f7dd1017e2ba49"
    ? { name: "", timeout: "" }
    : value === "60f62de769f7dd1017e2ba4b"
    ? {
        postal: "",
        type: "",
        recipient: "",
        released_by: "",
        released_date: "",
      }
    : value === "60f62dd969f7dd1017e2ba4a"
    ? {
        with_paper: false,
        back_to_back: false,
        documents: [],
      }
    : {};

export default changeServices;
