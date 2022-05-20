import Register from "../../components/pages/Register/Register";
import Step1 from "../../components/pages/Register/contents/Step1";
import Step2 from "../../components/pages/Register/contents/Step2";
import Step3 from "../../components/pages/Register/contents/Step3";
import Step4 from "../../components/pages/Register/contents/Step4";

import store from "../../store/store";

export const register_routes = {
  path: "/register/:user_type",
  component: Register,
  children: [
    { path: "step=1", component: Step1 },
    {
      path: "step=2",
      component: Step2,
      beforeEnter: (to, from, next) => {
        store.getters["faculty/getEmail"] || store.getters["admin/getEmail"]
          ? next()
          : next(`/register/${to.params.user_type}/step=1`);
      },
    },
    {
      path: "step=3",
      component: Step3,
      beforeEnter: (to, from, next) => {
        store.getters["faculty/getEmail"] || store.getters["admin/getEmail"]
          ? next()
          : next(`/register/${to.params.user_type}/step=1`);
      },
    },
    {
      path: "step=4",
      component: Step4,
      beforeEnter: (to, from, next) => {
        localStorage.getItem("Authorization")
          ? next()
          : next(`/register/${to.params.user_type}/step=1`);
      },
    },
  ],
};
