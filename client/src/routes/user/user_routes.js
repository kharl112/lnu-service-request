import HomeUser from "../../components/pages/Home/user/HomeUser";
import Drafts from "../../components/pages/Home/user/children/Drafts";
import Sent from "../../components/pages/Home/user/children/Sent";
import FacultyPending from "../../components/pages/Home/user/children/FacultyPending";
import FacultySigned from "../../components/pages/Home/user/children/FacultySigned";
import FacultyArchives from "../../components/pages/Home/user/children/FacultyArchives";
import FacultySettings from "../../components/pages/Home/user/children/FacultySettings";
import Compose from "../../components/pages/Home/user/children/Compose";
import Edit from "../../components/pages/Home/user/children/Edit";

import store from "../../store/store";
import axios from "axios";

export const user_routes = {
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
};
