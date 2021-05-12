import axios from "axios";
import { router } from "../../main";

const admin = {
  namespaced: true,
  state: () => ({
    user: null,
    error: {
      login: null,
    },
    loading: {
      login: false,
    },
  }),
  getters: {
    getUser: (state) => state.user,
    getError: (state) => state.error,
    getLoading: (state) => state.loading,
    getEmail: (state) => state.email,
  },
  mutations: {
    setError: (state, { message, type }) => (state.error[type] = message),
    clearError: (state) => {
      return (state.error = { login: null, email: null, register: null });
    },
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
  },
  actions: {
    adminLogin: async ({ commit }, form) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "login" });
      try {
        const { data } = await axios.post("/api/admin/login", form);
        commit("setLoading", { loading: false, type: "login" });
        sessionStorage.setItem("Authorization", data.token);
        return router.replace("/admin/home/");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "login" });
        return commit("setError", { message, type: "login" });
      }
    },
  },
};

export default admin;
