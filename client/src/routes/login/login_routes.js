import Login from "../../components/pages/Login/Login";

import store from "../../store/store";

export const login_routes = {
  path: "/:user_type/login",
  component: Login,
  beforeEnter: (to, from, next) => {
    store.dispatch("message/defaultState", null);
    const { user_type } = to.params;
    return user_type === "faculty" || user_type === "admin"
      ? next()
      : next(false);
  },
};
