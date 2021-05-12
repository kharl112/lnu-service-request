import Register from "../components/pages/Register/Register";
import Step1 from "../components/pages/Register/contents/Step1";
import Step2 from "../components/pages/Register/contents/Step2";
import Step3 from "../components/pages/Register/contents/Step3";
import Step4 from "../components/pages/Register/contents/Step4";
import Login from "../components/pages/Login/Login";
import HomeUser from "../components/pages/Home/user/HomeUser";
import Drafts from "../components/pages/Home/user/children/Drafts";
import HomeAdmin from "../components/pages/Home/admin/HomeAdmin";
import Tokens from "../components/pages/Home/admin/children/Tokens";
import Signed from "../components/pages/Home/admin/children/Signed";
import Pending from "../components/pages/Home/admin/children/Pending";

import store from "../store/store";

export const routes = [
  {
    path: "/:user_type/login",
    component: Login,
    beforeEnter: (to, from, next) => {
      const { user_type } = to.params;
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
      return user_type === "faculty" ? next() : next(false);
    },
    children: [
      { path: "step=1", component: Step1 },
      {
        path: "step=2",
        component: Step2,
        beforeEnter: (to, from, next) => {
          return store.getters["faculty/getEmail"]
            ? next()
            : next("/faculty/register/step=1");
        },
      },
      {
        path: "step=3",
        component: Step3,
        beforeEnter: (to, from, next) => {
          return store.getters["faculty/getEmail"]
            ? next()
            : next("/faculty/register/step=1");
        },
      },
      {
        path: "step=4",
        component: Step4,
        beforeEnter: (to, from, next) => {
          return store.getters["faculty/getEmail"] &&
            sessionStorage.getItem("Authorization")
            ? next()
            : next("/faculty/register/step=1");
        },
      },
    ],
  },
  {
    path: "/faculty/home",
    component: HomeUser,
    beforeEnter: async (to, from, next) => {
      if (sessionStorage.getItem("Authorization")) {
        await store.dispatch("faculty/userProfile");
        if (store.getters["faculty/getProfile"]) return next();
        return next("/faculty/login");
      }
      return next("/faculty/login");
    },
    children: [{ path: "drafts", component: Drafts }],
  },
  {
    path: "/admin/home",
    component: HomeAdmin,
    beforeEnter: async (to, from, next) => {
      if (sessionStorage.getItem("Authorization")) {
        await store.dispatch("admin/adminProfile");
        if (store.getters["admin/getProfile"]) return next();
        return next("/admin/login");
      }
      return next("/admin/login");
    },
    children: [
      { path: "tokens", component: Tokens },
      { path: "signed", component: Signed },
      { path: "pending", component: Pending },
    ],
  },
];
