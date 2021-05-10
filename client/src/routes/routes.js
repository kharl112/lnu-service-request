import Register from "../components/pages/Register/Register";
import Step1 from "../components/pages/Register/contents/Step1";
import Step2 from "../components/pages/Register/contents/Step2";
import Step3 from "../components/pages/Register/contents/Step3";
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
      return user_type === "faculty" ? next() : next(false);
    },
    children: [
      { path: "step=1", component: Step1 },
      { path: "step=2", component: Step2 },
      { path: "step=3", component: Step3 },
    ],
  },
];
