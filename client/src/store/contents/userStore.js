import axios from "axios";
import { router } from "../../main";

const faculty = {
  namespaced: true,
  state: () => ({
    profile: null,
    email: null,
    heads: null,
    error: {
      profile: null,
      login: null,
      email: null,
      register: null,
      all_head: null,
    },
    loading: {
      profile: false,
      login: false,
      email: false,
      register: false,
      all_head: null,
    },
  }),
  getters: {
    getProfile: (state) => state.profile,
    getError: (state) => state.error,
    getLoading: (state) => state.loading,
    getEmail: (state) => state.email,
    getAllHead: (state) => state.heads,
  },
  mutations: {
    setError: (state, { message, type }) => (state.error[type] = message),
    setEmail: (state, email) => (state.email = email),
    clearError: (state) => {
      return (state.error = {
        profile: null,
        login: null,
        email: null,
        register: null,
        all_head: null,
      });
    },
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
    setProfile: (state, user_profile) => (state.profile = user_profile),
    setAllHead: (state, heads) => (state.heads = [...heads]),
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
      commit("clearError");
      commit("setLoading", { loading: true, type: "profile" });
      try {
        const { data } = await axios.get("/api/user/profile", {
          headers: { Authorization: sessionStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "profile" });
        return commit("setProfile", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "profile" });
        commit("setProfile", null);
        commit("setError", { message, type: "profile" });
        return message === "account not permitted"
          ? router.replace("/faculty/register/step=4")
          : router.replace("/faculty/login");
      }
    },
    allHead: async ({ commit }) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "all_head" });
      try {
        const { data } = await axios.get("/api/user/head/all", {
          headers: { Authorization: sessionStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all_head" });
        return commit("setAllHead", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all_head" });
        return commit("setError", { message, type: "all_head" });
      }
    },
  },
};

export default faculty;
