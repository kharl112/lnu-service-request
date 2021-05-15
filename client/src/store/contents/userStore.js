import axios from "axios";
import { router } from "../../main";

const faculty = {
  namespaced: true,
  state: () => ({
    profile: null,
    email: null,
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
    getProfile: (state) => state.profile,
    getError: (state) => state.error,
    getLoading: (state) => state.loading,
    getEmail: (state) => state.email,
  },
  mutations: {
    setError: (state, { message, type }) => (state.error[type] = message),
    setEmail: (state, email) => (state.email = email),
    clearError: (state) => {
      return (state.error = { login: null, email: null, register: null });
    },
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
    setProfile: (state, user_profile) => (state.profile = user_profile),
  },
  actions: {
    userLogin: async ({ commit }, form) => {
      commit("clearError");
      commit("setProfile", null);
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
      commit("setProfile", null);
      commit("setLoading", { loading: true, type: "register" });
      try {
        const { data } = await axios.post("/api/user/create", form);
        commit("setLoading", { loading: false, type: "register" });
        sessionStorage.setItem("Authorization", data.token);
        return router.replace("/faculty/register/step=4");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "register" });
        return commit("setError", { message, type: "register" });
      }
    },
    validateEmail: async ({ commit }, form) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "email" });
      try {
        const { data } = await axios.post("/api/user/validate/email", form);
        commit("setLoading", { loading: false, type: "email" });
        commit("setEmail", data.email);
        return router.replace("/faculty/register/step=2");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "email" });
        commit("setEmail", null);
        return commit("setError", { message, type: "email" });
      }
    },
    userProfile: async ({ commit }) => {
      try {
        const { data } = await axios.get("/api/user/profile", {
          headers: { Authorization: sessionStorage.getItem("Authorization") },
        });
        return commit("setProfile", data);
      } catch (error) {
        const { message } = error.response.data || error;
        return message === "account not permitted"
          ? router.replace("/faculty/register/step=4")
          : router.replace("/faculty/login");
      }
    },
  },
};

export default faculty;
