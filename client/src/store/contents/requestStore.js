import axios from "axios";
import { router } from "../../main";

const request = {
  namespaced: true,
  state: () => ({
    snackbar: { compose: false, edit: false },
    all_draft: null,
    all_send: null,
    letter_info: {},
    selected: [],
    error: {
      compose: null,
      all_draft: null,
      all_send: null,
      selected: null,
      letter_info: null,
      edit: null,
    },
    loading: {
      compose: null,
      all_draft: null,
      all_send: null,
      selected: null,
      letter_info: null,
      edit: null,
    },
  }),
  getters: {
    getError: (state) => state.error,
    getSnackbar: (state) => state.snackbar,
    getAllDraft: (state) => state.all_draft,
    getAllSend: (state) => state.all_send,
    getLetterInfo: (state) => state.letter_info,
    getSelected: (state) => state.selected,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setError: (state, { message, type }) => (state.error[type] = message),
    clearError: (state) =>
      (state.error = {
        compose: null,
        all_draft: null,
        all_send: null,
        selected: null,
        letter_info: null,
      }),
    setSnackbar: (state, { snackbar, type }) =>
      (state.snackbar[type] = snackbar),
    setAllDraft: (state, all_draft) => (state.all_draft = [...all_draft]),
    setAllSend: (state, all_send) => (state.all_send = [...all_send]),
    setLetterInfo: (state, letter_info) => (state.letter_info = letter_info),
    setSelected: (state, selected) => (state.selected = selected),
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
  },
  actions: {
    createRequest: async ({ commit }, form) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "compose" });
      try {
        await axios.post("/api/request/create", form, {
          headers: { Authorization: sessionStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "compose" });
        return router.push("/faculty/home/drafts");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "compose" });
        commit("setSnackbar", { snackbar: true, type: "compose" });
        return commit("setError", { message, type: "compose" });
      }
    },
    allDraft: async ({ commit }) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "all_draft" });
      try {
        const { data } = await axios.get("/api/request/faculty/draft", {
          headers: { Authorization: sessionStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all_draft" });
        return commit("setAllDraft", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all_draft" });
        return commit("setError", { message, type: "all_draft" });
      }
    },
    allSend: async ({ commit }) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "all_send" });
      try {
        const { data } = await axios.get("/api/request/faculty/sent", {
          headers: { Authorization: sessionStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all_send" });
        return commit("setAllSend", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all_send" });
        return commit("setError", { message, type: "all_send" });
      }
    },
    deleteSelected: async ({ commit, getters, dispatch }) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "selected" });
      try {
        await axios.post(
          "/api/request/faculty/draft/delete/selected",
          { selected: getters.getSelected },
          {
            headers: { Authorization: sessionStorage.getItem("Authorization") },
          }
        );
        commit("setLoading", { loading: false, type: "selected" });
        commit("setSelected", []);
        return dispatch("allDraft");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "selected" });
        commit("setSelected", []);
        return commit("setError", { message, type: "selected" });
      }
    },
    editRequest: async ({ commit }, form) => {
      commit("clearError");
      commit("setLoading", { loading: true, type: "edit" });
      try {
        await axios.post("/api/request/faculty/update/letter=:id", form, {
          headers: { Authorization: sessionStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "edit" });
        return router.push("/faculty/home/drafts");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "edit" });
        commit("setSnackbar", { snackbar: true, type: "edit" });
        return commit("setError", { message, type: "edit" });
      }
    },
  },
};
export default request;
