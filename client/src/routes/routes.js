import Register from "../components/pages/Register/Register";
import Login from "../components/pages/Login/Login";

export const routes = [
  {
    path: "/:user_type/login",
    component: Login,
    beforeEnter: (to, from, next) => {
      const { user_type } = to.params;
      console.log(user_type);
      return user_type === "faculty" || user_type === "admin"
        ? next()
        : next(false);
    },
  },
  {
    path: "/:user_type/register",
    component: Register,
    beforeEnter: (to, from, next) => {
      const { user_type } = to.params;
      console.log(user_type);
      return user_type === "faculty" || user_type === "admin"
        ? next()
        : next(false);
    },
  },
];
