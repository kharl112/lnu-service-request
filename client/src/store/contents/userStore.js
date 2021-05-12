import axios from "axios";
import { router } from "../../main";

const faculty = {
  namespaced: true,
  state: () => ({
    user: null,
    error: {
      login: null,
      email: null,
      register: null,
    },
    loading: {
      login: false,
      email: false,
      register: false,
    },
  }),
  getters: {
    getUser: (state) => state.user,
    getError: (state) => state.error,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setError: (state, { message, type }) => (state.error[type] = message),
    clearError: (state) => {
      return (state.error = { login: null, email: null, register: null });
    },
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
  },
  actions: {
    userLogin: async ({ commit }, form) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "login" });
      try {
        const { data } = await axios.post("/api/user/login", form);
        commit("setLoading", { loading: false, type: "login" });
        sessionStorage.setItem("Authorization", data.token);
        return router.replace("/faculty/home/drafts");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "login" });
        return commit("setError", { message, type: "login" });
      }
    },
    userRegister: async ({ commit }, form) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "register" });
      try {
        const { data } = await axios.post("/api/user/create", form);
        commit("setLoading", { loading: false, type: "register" });
        return sessionStorage.setItem("Authorization", data.token);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "register" });
        return commit("setError", { message, type: "register" });
      }
    },
  },
};

export default faculty;
