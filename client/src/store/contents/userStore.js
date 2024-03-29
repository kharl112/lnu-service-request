import axios from "axios";
import { router } from "../../main";

const faculty = {
  namespaced: true,
  state: () => ({
    profile: null,
    email: null,
    all_service_providers: [],
    all_users: [],
    loading: {
      profile: false,
      login: false,
      email: false,
      register: false,
      update: false,
      change_password: false,
      all_service_providers: false,
      all_users: false,
      send_email_link: false,
      reset_password: false,
      availability: false
    },
  }),
  getters: {
    getProfile: (state) => state.profile,
    getLoading: (state) => state.loading,
    getEmail: (state) => state.email,
    getAllServiceProviders: (state) => state.all_service_providers,
    getAllUsers: (state) => state.all_users,
  },
  mutations: {
    setEmail: (state, email) => (state.email = email),
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
    setProfile: (state, user_profile) => (state.profile = user_profile),
    setAllServiceProviders: (state, service_providers) =>
      (state.all_service_providers = [...service_providers]),
    setAllUsers: (state, all_users) => (state.all_users = [...all_users]),
  },
  actions: {
    Login: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      dispatch("request/defaultState", null, { root: true });
      commit("setProfile", null);
      commit("setLoading", { loading: true, type: "login" });
      try {
        const { data } = await axios.post("/api/user/login", form);
        commit("setLoading", { loading: false, type: "login" });
        localStorage.setItem("Authorization", data.token);
        localStorage.setItem("UserType", "user");

        router.replace("/faculty/home/dashboard");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "login" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    userRegister: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      dispatch("request/defaultState", null, { root: true });
      commit("setProfile", null);
      commit("setLoading", { loading: true, type: "register" });
      try {
        const { data } = await axios.post("/api/user/create", form);
        commit("setLoading", { loading: false, type: "register" });
        localStorage.setItem("Authorization", data.token);
        localStorage.setItem("UserType", "user");
        router.replace("/faculty/home/dashboard");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "register" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    userUpdate: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "update" });
      try {
        await axios.post("/api/user/update", form, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "update" });
        dispatch("message/successMessage", "updated successfully", {
          root: true,
        });
        dispatch("Profile");
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
        const { data } = await axios.post("/api/user/validate/email", form);
        commit("setLoading", { loading: false, type: "email" });
        commit("setEmail", data.email);
        router.replace("/register/faculty/step=2");
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
        await axios.post("/api/user/change/password", form, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "change_password" });
        dispatch("message/successMessage", "password changed", {
          root: true,
        });
        router.replace("/faculty/home/dashboard");
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
          `/api/user/reset/password/${encrypted_id}`,
          form
        );
        commit("setLoading", { loading: false, type: "reset_password" });
        localStorage.setItem("Authorization", data.token);
        localStorage.setItem("UserType", "user");
        router.replace("/faculty/home/dashboard");
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
        await axios.post("/api/user/send/email/link", form);
        commit("setLoading", { loading: false, type: "send_email_link" });
        dispatch("message/successMessage", "E-mail sent", {
          root: true,
        });
        router.replace("/forgot/password/step=2");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "send_email_link" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    Profile: async ({ commit, dispatch }) => {
      commit("setLoading", { loading: true, type: "profile" });
      try {
        const { data } = await axios.get("/api/user/profile", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "profile" });
        commit("setProfile", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "profile" });
        commit("setProfile", null);
        dispatch("message/errorMessage", message, { root: true });
        router.replace("/login");
      }
    },
    allUsers: async ({ commit, dispatch }, { type }) => {
      commit("setLoading", { loading: true, type: "all_users" });
      try {
        const { data } = await axios.get(`/api/user/${type}`, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all_users" });
        commit("setAllUsers", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all_users" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    allServiceProviders: async ({ commit, dispatch, state }, staff_id) => {
      if (!state.all_service_providers[0])
        commit("setLoading", { loading: true, type: "all_service_providers" });
      try {
        const { data } = await axios.get(`/api/user/provider/all?staff_id=${staff_id ? staff_id : ''}`, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all_service_providers" });
        commit("setAllServiceProviders", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all_service_providers" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    setAvailability: async ({ commit, dispatch }) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "availability" });

      try {

        const { data } = await axios.post("/api/user/change/availability", {}, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });

        await dispatch("Profile");

        commit("setLoading", { loading: false, type: "availability" });
        dispatch("message/successMessage", data.message, { root: true });
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "availability" });
        dispatch("message/errorMessage", message, { root: true });
      }
    }
  },
};

export default faculty;
