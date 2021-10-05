import Landing from "../../components/pages/Landing/Landing";

export const landing_routes = {
  path: "/",
  component: Landing,
  beforeEnter: (to, from, next) => {
    if (
      !!localStorage.getItem("Authorization") &&
      !!localStorage.getItem("UserType")
    ) {
      return localStorage.getItem("UserType") === "admin"
        ? next("/admin/home/pending")
        : next("/faculty/home/drafts");
    }
    next();
  },
};
