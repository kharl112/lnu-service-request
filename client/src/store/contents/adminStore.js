import axios from "axios";
import { router } from "../../main";

const admin = {
  namespaced: true,
  state: () => ({
    profile: null,
    all_admins: [],
    email: null,
    loading: {
      login: false,
      email: false,
      register: false,
      update: false,
      change_password: false,
      all_admin: false,
      reset_password: false,
      send_email_link: false,
    },
  }),
  getters: {
    getProfile: (state) => state.profile,
    getLoading: (state) => state.loading,
    getEmail: (state) => state.email,
    getAllAdmin: (state) => state.all_admins,
  },
  mutations: {
    setEmail: (state, email) => (state.email = email),
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
    setProfile: (state, admin_profile) => (state.profile = admin_profile),
    setAllAdmin: (state, all_admins) => (state.all_admins = [...all_admins]),
  },
  actions: {
    Login: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      dispatch("request/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "login" });
      commit("setProfile", null);
      try {
        const { data } = await axios.post("/api/admin/login", form);
        commit("setLoading", { loading: false, type: "login" });
        localStorage.setItem("Authorization", data.token);
        localStorage.setItem("UserType", "admin");
        router.replace("/admin/home/pending");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "login" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    adminRegister: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      dispatch("request/defaultState", null, { root: true });
      commit("setProfile", null);
      commit("setLoading", { loading: true, type: "register" });
      try {
        delete form.department;
        const { data } = await axios.post("/api/admin/create", form);
        commit("setLoading", { loading: false, type: "register" });
        localStorage.setItem("Authorization", data.token);
        localStorage.setItem("UserType", "admin");
        router.replace("/admin/register/step=4");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "register" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    adminUpdate: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "update" });
      try {
        await axios.post("/api/admin/update", form, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "update" });
        dispatch("message/successMessage", "updated successfully", {
          root: true,
        });
        dispatch("adminProfile");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "update" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    validateEmail: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "email" });
      try {
        const { data } = await axios.post("/api/admin/validate/email", form);
        commit("setLoading", { loading: false, type: "email" });
        commit("setEmail", data.email);
        router.replace("/admin/register/step=2");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "email" });
        commit("setEmail", null);
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    changePassword: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "change_password" });
      try {
        await axios.post("/api/admin/change/password", form, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "change_password" });
        dispatch("message/successMessage", "password changed", {
          root: true,
        });
        router.replace("/admin/home/pending");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "change_password" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    resetPassword: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setProfile", null);
      commit("setLoading", { loading: true, type: "reset_password" });
      try {
        const { encrypted_id } = router.history.current.params;
        const { data } = await axios.post(
          `/api/admin/reset/password/${encrypted_id}`,
          form
        );
        commit("setLoading", { loading: false, type: "reset_password" });
        localStorage.setItem("Authorization", data.token);
        localStorage.setItem("UserType", "admin");
        router.replace("/admin/home/pending");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "reset_password" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    sendEmailLink: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "send_email_link" });
      try {
        await axios.post("/api/admin/send/email/link", form);
        commit("setLoading", { loading: false, type: "send_email_link" });
        dispatch("message/successMessage", "E-mail sent", {
          root: true,
        });
        router.replace("/admin/forgot/password/step=2");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "send_email_link" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    adminProfile: async ({ commit, dispatch }) => {
      try {
        const { data } = await axios.get("/api/admin/profile", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        return commit("setProfile", data);
      } catch (error) {
        const { message } = error.response.data || error;
        dispatch("message/errorMessage", message, { root: true });
        router.replace("/login");
      }
    },
    allAdmin: async ({ commit, dispatch, state }) => {
      dispatch("message/defaultState", null, { root: true });
      if (!state.all_admins[0])
        commit("setLoading", { loading: true, type: "all_admin" });
      try {
        const { data } = await axios.get("/api/admin/all", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all_admin" });
        commit("setAllAdmin", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all_admin" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default admin;
