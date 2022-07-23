import axios from "axios";

const activity_log = {
  namespaced: true,
  state: () => ({
    activity_logs: [],
    loading: {
      user: false,
      admin: false,
    },
  }),
  getters: {
    getActivityLogs: (state) => state.activity_logs,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setActivityLogs: (state, activity_logs) =>
      (state.activity_logs = [...activity_logs]),
    setLoading: (state, { type, loading }) => (state.loading[type] = loading),
  },
  actions: {
    userActivityLogs: async ({ commit, dispatch, state }) => {
      if (!state.activity_logs.length)
        commit("setLoading", { type: "user", loading: true });

      try {
        const { data } = await axios.get("/api/activity-log/faculty", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });

        commit("setLoading", { type: "user", loading: false });
        commit("setActivityLogs", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { type: "user", loading: false });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    adminActivityLogs: async ({ commit, dispatch, state }) => {
      if (!state.activity_logs.length)
        commit("setLoading", { type: "admin", loading: true });

      try {
        const { data } = await axios.get("/api/activity-log/admin", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });

        commit("setLoading", { type: "admin", loading: false });
        commit("setActivityLogs", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { type: "admin", loading: false });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default activity_log;
