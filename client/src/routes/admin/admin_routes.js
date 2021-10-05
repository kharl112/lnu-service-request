import HomeAdmin from "../../components/pages/Home/admin/HomeAdmin";
import AdminSigned from "../../components/pages/Home/admin/children/AdminSigned";
import AdminPending from "../../components/pages/Home/admin/children/AdminPending";
import AdminSettings from "../../components/pages/Home/admin/children/AdminSettings";
import AdminArchives from "../../components/pages/Home/admin/children/AdminArchives";

import store from "../../store/store";

export const admin_routes = {
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
    { path: "archives", component: AdminArchives },
  ],
};
