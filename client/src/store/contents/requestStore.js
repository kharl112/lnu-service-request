import axios from "axios";
import { router } from "../../main";

const request = {
  namespaced: true,
  state: () => ({
    all_draft: [],
    all_send: [],
    all_pending: [],
    all_signed: [],
    letter_info: {},
    selected: [],
    loading: {
      compose: false,
      all_draft: false,
      all_send: false,
      all_pending: false,
      all_signed: false,
      selected: false,
      letter_info: false,
      send: false,
      edit: false,
      sign: false,
    },
  }),
  getters: {
    getAllDraft: (state) => state.all_draft,
    getAllSend: (state) => state.all_send,
    getAllPending: (state) => state.all_pending,
    getAllSigned: (state) => state.all_signed,
    getLetterInfo: (state) => state.letter_info,
    getSelected: (state) => state.selected,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setAllDraft: (state, all_draft) => (state.all_draft = [...all_draft]),
    setAllSend: (state, all_send) => (state.all_send = [...all_send]),
    setAllPending: (state, all_pending) =>
      (state.all_pending = [...all_pending]),
    setAllSigned: (state, all_signed) => (state.all_signed = [...all_signed]),
    setLetterInfo: (state, letter_info) => (state.letter_info = letter_info),
    setSelected: (state, selected) => (state.selected = selected),
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
  },
  actions: {
    createRequest: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "compose" });
      try {
        await axios.post("/api/request/create", form, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "compose" });
        dispatch("message/successMessage", "request letter created", {
          root: true,
        });
        return router.push("/faculty/home/drafts");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "compose" });
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    allDraft: async ({ commit, dispatch }) => {
      commit("setLoading", { loading: true, type: "all_draft" });
      try {
        const { data } = await axios.get("/api/request/faculty/draft", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all_draft" });
        return commit("setAllDraft", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all_draft" });
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    allSend: async ({ commit, dispatch }) => {
      commit("setLoading", { loading: true, type: "all_send" });
      try {
        const { data } = await axios.get("/api/request/faculty/sent", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all_send" });
        return commit("setAllSend", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all_send" });
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    allPending: async ({ commit, dispatch }, type) => {
      commit("setLoading", { loading: true, type: "all_pending" });
      try {
        const { data } = await axios.get(`/api/request/${type}/pending`, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all_pending" });
        return commit("setAllPending", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all_pending" });
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    allSigned: async ({ commit, dispatch }, type) => {
      commit("setLoading", { loading: true, type: "all_signed" });
      try {
        const { data } = await axios.get(`/api/request/${type}/signed`, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all_signed" });
        return commit("setAllSigned", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all_signed" });
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    deleteSelected: async ({ commit, getters, dispatch }) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "selected" });
      try {
        await axios.post(
          "/api/request/faculty/draft/delete/selected",
          { selected: getters.getSelected },
          {
            headers: { Authorization: localStorage.getItem("Authorization") },
          }
        );
        commit("setLoading", { loading: false, type: "selected" });
        commit("setSelected", []);
        dispatch("message/successMessage", "selected request letter deleted", {
          root: true,
        });
        return dispatch("allDraft");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "selected" });
        commit("setSelected", []);
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    editRequest: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "edit" });
      const { id } = router.history.current.params;
      try {
        await axios.post(
          `/api/request/faculty/update/letter=${id}`,
          { form },
          {
            headers: { Authorization: localStorage.getItem("Authorization") },
          }
        );
        dispatch("message/successMessage", "request letter updated", {
          root: true,
        });
        commit("setLoading", { loading: false, type: "edit" });
        return router.push("/faculty/home/drafts");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "edit" });
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    sendRequest: async ({ commit, dispatch }, { _id }) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "send" });
      try {
        await axios.post(
          `/api/request/faculty/send/letter=${_id}`,
          {},
          {
            headers: { Authorization: localStorage.getItem("Authorization") },
          }
        );
        dispatch("message/successMessage", "request letter sent", {
          root: true,
        });
        commit("setLoading", { loading: false, type: "send" });
        return router.push("/faculty/home/sent");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "send" });
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    signRequest: async (
      { commit, dispatch },
      { request_id, signature, type }
    ) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "sign" });
      try {
        await axios.post(
          `/api/request/${type}/sign`,
          { request_id, signature },
          {
            headers: { Authorization: localStorage.getItem("Authorization") },
          }
        );

        dispatch("message/successMessage", "request letter signed", {
          root: true,
        });

        await dispatch("allPending", type);
        commit("setLoading", { loading: false, type: "sign" });
        return router.push(
          `/${type === "service_provider" ? "faculty" : "admin"}/home/signed`
        );
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "sign" });
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};
export default request;
