import Register from "../components/pages/Register/Register";
import Step1 from "../components/pages/Register/contents/Step1";
import Step2 from "../components/pages/Register/contents/Step2";
import Step3 from "../components/pages/Register/contents/Step3";
import Step4 from "../components/pages/Register/contents/Step4";

import Login from "../components/pages/Login/Login";

import Landing from "../components/pages/Landing/Landing";

import TrackRequest from "../components/pages/Track/TrackRequest";

import ForgotPassword from "../components/pages/ForgotPassword/ForgotPassword";
import Pass1 from "../components/pages/ForgotPassword/contents/Pass1";
import Pass2 from "../components/pages/ForgotPassword/contents/Pass2";
import Pass3 from "../components/pages/ForgotPassword/contents/Pass3";

import HomeUser from "../components/pages/Home/user/HomeUser";
import Drafts from "../components/pages/Home/user/children/Drafts";
import Sent from "../components/pages/Home/user/children/Sent";
import FacultyPending from "../components/pages/Home/user/children/FacultyPending";
import FacultySigned from "../components/pages/Home/user/children/FacultySigned";
import FacultyArchives from "../components/pages/Home/user/children/FacultyArchives";
import FacultySettings from "../components/pages/Home/user/children/FacultySettings";
import Compose from "../components/pages/Home/user/children/Compose";
import Edit from "../components/pages/Home/user/children/Edit";

import HomeAdmin from "../components/pages/Home/admin/HomeAdmin";
import AdminSigned from "../components/pages/Home/admin/children/AdminSigned";
import AdminPending from "../components/pages/Home/admin/children/AdminPending";
import AdminSettings from "../components/pages/Home/admin/children/AdminSettings";

import store from "../store/store";
import axios from "axios";

export const routes = [
  {
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
  },
  {
    path: "/track/:_id",
    name: "track",
    component: TrackRequest,
  },
  {
    path: "/:user_type/login",
    component: Login,
    beforeEnter: (to, from, next) => {
      store.dispatch("message/defaultState", null);
      const { user_type } = to.params;
      return user_type === "faculty" || user_type === "admin"
        ? next()
        : next(false);
    },
  },
  {
    path: "/:user_type/forgot/password",
    component: ForgotPassword,
    beforeEnter: (to, from, next) => {
      store.dispatch("message/defaultState", null);
      const { user_type } = to.params;
      return user_type === "faculty" || user_type === "admin"
        ? next()
        : next(false);
    },
    children: [
      { path: "step=1", component: Pass1 },
      { path: "step=2", component: Pass2 },
      { path: "reset/:encrypted_id", component: Pass3 },
    ],
  },
  {
    path: "/:user_type/register",
    component: Register,
    beforeEnter: (to, from, next) => {
      store.dispatch("message/defaultState", null);
      const { user_type } = to.params;
      return user_type === "faculty" || user_type === "admin"
        ? next()
        : next(false);
    },
    children: [
      { path: "step=1", component: Step1 },
      {
        path: "step=2",
        component: Step2,
        beforeEnter: (to, from, next) => {
          return store.getters["faculty/getEmail"] ||
            store.getters["admin/getEmail"]
            ? next()
            : next(`/${to.params.user_type}/register/step=1`);
        },
      },
      {
        path: "step=3",
        component: Step3,
        beforeEnter: (to, from, next) => {
          return store.getters["faculty/getEmail"] ||
            store.getters["admin/getEmail"]
            ? next()
            : next(`/${to.params.user_type}/register/step=1`);
        },
      },
      {
        path: "step=4",
        component: Step4,
        beforeEnter: (to, from, next) => {
          return localStorage.getItem("Authorization")
            ? next()
            : next(`/${to.params.user_type}/register/step=1`);
        },
      },
    ],
  },
  {
    path: "/faculty/home",
    component: HomeUser,
    beforeEnter: async (to, from, next) => {
      store.dispatch("message/defaultState", null);
      return localStorage.getItem("Authorization")
        ? next()
        : next("/faculty/login");
    },
    children: [
      { path: "drafts", component: Drafts },
      { path: "sent", component: Sent },
      { path: "compose", component: Compose },
      { path: "settings", component: FacultySettings },
      { path: "pending", component: FacultyPending },
      { path: "signed", component: FacultySigned },
      { path: "archives", component: FacultyArchives },
      {
        path: "edit/letter=:id",
        component: Edit,
        beforeEnter: async (to, from, next) => {
          store.dispatch("message/defaultState", null);
          store.commit("request/setLoading", {
            loading: true,
            type: "letter_info",
          });
          try {
            const { id } = to.params;
            const { data } = await axios.get(
              `/api/request/faculty/letter=${id}`,
              {
                headers: {
                  Authorization: localStorage.getItem("Authorization"),
                },
              }
            );
            store.commit("request/setLoading", {
              loading: false,
              type: "letter_info",
            });
            if (data.form) {
              store.commit("request/setLetterInfo", data.form);
              return next();
            }
            return next("/faculty/home/drafts");
          } catch (error) {
            const { message } = error.response.data || error;
            store.commit("request/setLoading", {
              loading: false,
              type: "letter_info",
            });
            store.commit("request/setLetterInfo", {});
            store.dispatch("message/errorMessage", message);
            return next("/faculty/home/drafts");
          }
        },
      },
    ],
  },
  {
    path: "/admin/home",
    component: HomeAdmin,
    beforeEnter: async (to, from, next) => {
      store.dispatch("message/defaultState", null);
      return localStorage.getItem("Authorization") ? next() : next(false);
    },
    children: [
      { path: "settings", component: AdminSettings },
      { path: "pending", component: AdminPending },
      { path: "signed", component: AdminSigned },
    ],
  },
];
