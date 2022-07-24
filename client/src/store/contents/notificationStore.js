import axios from "axios";

const notification = {
  namespaced: true,
  state: () => ({
    notifications: [],
    loading: {
      faculty: false,
      admin: false,
    },
  }),
  getters: {
    getNotifications: (state) => state.notifications,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setNotifications: (state, notifications) =>
      (state.notifications = [...notifications]),
    setLoading: (state, { type, loading }) => (state.loading[type] = loading),
  },
  actions: {
    notifications: async (
      { commit, dispatch, state },
      { user_type, filter }
    ) => {
      if (!state.notifications.length)
        commit("setLoading", { type: user_type, loading: true });

      try {
        let path = `/api/notification/${user_type}`;

        if (filter) {
          path +=
            filter === "unread"
              ? "?unread=true"
              : filter === "read"
              ? "?unread=false"
              : "";
        }

        const { data } = await axios.get(path, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });

        commit("setLoading", { type: user_type, loading: false });
        commit("setNotifications", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { type: user_type, loading: false });
        dispatch("message/errorMessage", message, { root: true });
      }
    },

    markAsRead: async (
      { commit, dispatch, state },
      { user_type, notification_id }
    ) => {
      if (!state.notifications.length)
        commit("setLoading", { type: user_type, loading: true });

      try {
        await axios.post(
          `/api/notification/${user_type}/read/id=${notification_id}`,
          {},
          {
            headers: { Authorization: localStorage.getItem("Authorization") },
          }
        );

        commit("setLoading", { type: user_type, loading: false });
        dispatch("notifications", { user_type, filter: null });
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { type: user_type, loading: false });
        dispatch("message/errorMessage", message, { root: true });
      }
    },

    markAllAsRead: async ({ commit, dispatch, state }, user_type) => {
      if (!state.notifications.length)
        commit("setLoading", { type: user_type, loading: true });

      try {
        const { data } = await axios.post(
          `/api/notification/${user_type}/read/all`,
          {},
          {
            headers: { Authorization: localStorage.getItem("Authorization") },
          }
        );

        commit("setLoading", { type: user_type, loading: false });
        dispatch("message/successMessage", data.message, { root: true });
        dispatch("notifications", { user_type, filter: null });
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { type: user_type, loading: false });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default notification;
