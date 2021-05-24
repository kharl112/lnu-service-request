import axios from "axios";
import { router } from "../../main";

const admin = {
  namespaced: true,
  state: () => ({
    profile: null,
    admins: null,
    error: {
      login: null,
      all_admin: null,
    },
    loading: {
      login: false,
      all_admin: false,
    },
  }),
  getters: {
    getProfile: (state) => state.profile,
    getError: (state) => state.error,
    getLoading: (state) => state.loading,
    getEmail: (state) => state.email,
    getAllAdmin: (state) => state.admins,
  },
  mutations: {
    setError: (state, { message, type }) => (state.error[type] = message),
    clearError: (state) => {
      return (state.error = { login: null, all_admin: null });
    },
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
    setProfile: (state, admin_profile) => (state.profile = admin_profile),
    setAllAdmin: (state, admins) => (state.admins = [...admins]),
  },
  actions: {
    adminLogin: async ({ commit }, form) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "login" });
      commit("setProfile", null);
      try {
        const { data } = await axios.post("/api/admin/login", form);
        commit("setLoading", { loading: false, type: "login" });
        sessionStorage.setItem("Authorization", data.token);
        return router.replace("/admin/home/tokens");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "login" });
        return commit("setError", { message, type: "login" });
      }
    },
    adminProfile: async ({ commit }) => {
      try {
        const { data } = await axios.get("/api/admin/profile", {
          headers: { Authorization: sessionStorage.getItem("Authorization") },
        });
        return commit("setProfile", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setError", { message, type: "login" });
        return router.replace("/admin/login");
      }
    },
    allAdmin: async ({ commit }) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "all_admin" });
      try {
        const { data } = await axios.get("/api/admin/all", {
          headers: { Authorization: sessionStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all_admin" });
        return commit("setAllAdmin", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all_admin" });
        return commit("setError", { message, type: "all_admin" });
      }
    },
  },
};

export default admin;
