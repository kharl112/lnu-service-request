import axios from "axios";
import { router } from "../../main";

const request = {
  namespaced: true,
  state: () => ({
    error: {
      compose: null,
    },
    loading: {
      compose: null,
    },
  }),
  getters: {
    getError: (state) => state.error,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setError: (state, { message, type }) => (state.error[type] = message),
    clearError: (state) => (state.error = { compose: null }),
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
  },
  actions: {
    createRequest: async ({ commit }, form) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "compose" });
      try {
        await axios.post("/api/admin/login", form);
        commit("setLoading", { loading: false, type: "compose" });
        return router.push("/faculty/home/drafts");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "compose" });
        return commit("setError", { message, type: "compose" });
      }
    },
  },
};
export default request;
