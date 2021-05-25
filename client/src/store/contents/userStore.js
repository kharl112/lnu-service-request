import axios from "axios";
import { router } from "../../main";

const faculty = {
  namespaced: true,
  state: () => ({
    profile: null,
    email: null,
    heads: null,
    loading: {
      profile: false,
      login: false,
      email: false,
      register: false,
      all_head: false,
    },
  }),
  getters: {
    getProfile: (state) => state.profile,
    getLoading: (state) => state.loading,
    getEmail: (state) => state.email,
    getAllHead: (state) => state.heads,
  },
  mutations: {
    setEmail: (state, email) => (state.email = email),
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
    setProfile: (state, user_profile) => (state.profile = user_profile),
    setAllHead: (state, heads) => (state.heads = [...heads]),
  },
  actions: {
    userLogin: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
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
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    userRegister: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
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
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    validateEmail: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
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
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    userProfile: async ({ commit, dispatch }) => {
      dispatch("message/defaultState", null, { root: true });
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
        dispatch("message/errorMessage", message, { root: true });
        return message === "account not permitted"
          ? router.replace("/faculty/register/step=4")
          : router.replace("/faculty/login");
      }
    },
    allHead: async ({ commit, dispatch }) => {
      dispatch("message/defaultState", null, { root: true });
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
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default faculty;
