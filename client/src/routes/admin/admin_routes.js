import HomeAdmin from "../../components/pages/Home/admin/HomeAdmin";
import AdminSigned from "../../components/pages/Home/admin/children/AdminSigned";
import AdminPending from "../../components/pages/Home/admin/children/AdminPending";
import AdminSettings from "../../components/pages/Home/admin/children/AdminSettings";
import AdminArchives from "../../components/pages/Home/admin/children/AdminArchives";
import ViewRequest from "../../components/pages/Home/admin/children/ViewRequest";
import NotFound from "../../components/pages/Home/admin/children/NotFound";

import store from "../../store/store";

export const admin_routes = {
  path: "/admin/home",
  component: HomeAdmin,
  beforeEnter: async (to, from, next) => {
    store.dispatch("message/defaultState", null);
    if (localStorage.getItem("Authorization")) {
      await store.dispatch("admin/Profile");
      if (store.getters["admin/getProfile"]) {
        next();
      } else next(false);
    } else next(false);
  },
  children: [
    { path: "settings", component: AdminSettings },
    { path: "pending", component: AdminPending },
    { path: "signed", component: AdminSigned },
    { path: "archives", component: AdminArchives },
    { path: "error/404", component: NotFound },
    {
      path: "view/:_id",
      component: ViewRequest,
      beforeEnter: async (to, from, next) => {
        await store.dispatch("request/Info", {
          _id: to.params._id,
          user_type: "admin",
        });

        if (store.getters["request/getInfo"]) {
          next();
        } else next("/admin/home/error/404");
      },
    },
  ],
};
