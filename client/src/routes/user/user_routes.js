import HomeUser from "../../components/pages/Home/user/HomeUser";
import Drafts from "../../components/pages/Home/user/children/Drafts";
import Sent from "../../components/pages/Home/user/children/Sent";
import FacultyPending from "../../components/pages/Home/user/children/FacultyPending";
import FacultySigned from "../../components/pages/Home/user/children/FacultySigned";
import FacultyArchives from "../../components/pages/Home/user/children/FacultyArchives";
import FacultySettings from "../../components/pages/Home/user/children/FacultySettings";
import Compose from "../../components/pages/Home/user/children/Compose";
import Edit from "../../components/pages/Home/user/children/Edit";
import ViewRequest from "../../components/pages/Home/user/children/ViewRequest";
import NotFound from "../../components/pages/Home/user/children/NotFound";
import FacultyDashboard from "../../components/pages/Home/user/children/FacultyDashboard";

import store from "../../store/store";

export const user_routes = {
  path: "/faculty/home",
  component: HomeUser,
  beforeEnter: async (to, from, next) => {
    store.dispatch("message/defaultState", null);
    if (localStorage.getItem("Authorization")) {
      await store.dispatch("faculty/Profile");
      if (store.getters["faculty/getProfile"]) {
        store.dispatch("request/Pendings", "provider");
        next();
      } else next(false);
    } else next(false);
  },
  children: [
    { path: "dashboard", component: FacultyDashboard },
    { path: "drafts", component: Drafts },
    { path: "sent", component: Sent },
    { path: "compose", component: Compose },
    { path: "settings", component: FacultySettings },
    {
      path: "pending",
      component: FacultyPending,
    },
    { path: "signed", component: FacultySigned },
    { path: "archives", component: FacultyArchives },
    { path: "error/404", component: NotFound },
    {
      path: "view/:user_type/:_id",
      component: ViewRequest,
      beforeEnter: async (to, from, next) => {
        const { user_type, _id } = to.params;
        if (["user", "provider"].filter((user) => user_type === user)[0]) {
          await store.dispatch("request/Info", {
            _id,
            user_type: "faculty",
          });
          if (store.getters["request/getInfo"]) {
            next();
          } else next("/faculty/home/error/404");
        } else next("/faculty/home/error/404");
      },
    },
    {
      path: "edit/:_id",
      component: Edit,
      beforeEnter: async (to, from, next) => {
        await store.dispatch("request/Info", {
          _id: to.params._id,
          user_type: "faculty",
        });
        if (store.getters["request/getInfo"]) {
          next();
        } else next("/faculty/home/error/404");
      },
    },
  ],
};
