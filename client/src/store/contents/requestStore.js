import axios from "axios";
import { router } from "../../main";

const request = {
  namespaced: true,
  state: () => ({
    all: [],
    drafts: [],
    sent: [],
    archives: [],
    pendings: [],
    signed: [],
    tracked: {},
    info: {},
    delete_selected: [],
    loading: {
      all: false,
      create: false,
      drafts: false,
      sent: false,
      archives: false,
      pendings: false,
      signed: false,
      tracked: false,
      delete_selected: false,
      info: false,
      send: false,
      edit: false,
      sign: false,
      mark: false,
      reject: false,
    },
  }),
  getters: {
    getAll: (state) => state.all,
    getDrafts: (state) => state.drafts,
    getSent: (state) => state.sent,
    getArchives: (state) => state.archives,
    getPendings: (state) => state.pendings,
    getSigned: (state) => state.signed,
    getTracked: (state) => state.tracked,
    getInfo: (state) => state.info,
    getDeleteSelected: (state) => state.delete_selected,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setAll: (state, all) => (state.all = [...all]),
    setDrafts: (state, drafts) => (state.drafts = [...drafts]),
    setSent: (state, sent) => (state.sent = [...sent]),
    setArchives: (state, archives) => (state.archives = [...archives]),
    setPendings: (state, pendings) => (state.pendings = [...pendings]),
    setSigned: (state, signed) => (state.signed = [...signed]),
    setTracked: (state, tracked) => (state.tracked = tracked),
    setInfo: (state, info) => (state.info = info),
    setDeleteSelected: (state, delete_selected) =>
      (state.delete_selected = delete_selected),
    setLoading: (state, { loading, type }) => (state.loading[type] = loading),
  },
  actions: {
    defaultState: ({ commit }) => {
      commit("setDrafts", []);
      commit("setSent", []);
      commit("setArchives", []);
      commit("setPendings", []);
      commit("setSigned", []);
    },
    Create: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "create" });
      try {
        await axios.post("/api/request/create", form, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "create" });
        dispatch("message/successMessage", "request letter created", {
          root: true,
        });
        router.push(
          form.reports.status === "created"
            ? "/faculty/home/drafts"
            : "/faculty/home/sent"
        );
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "create" });
        dispatch("message/errorMessage", message, { root: true });
        const user = router.history.current.fullPath.split("/")[1];
        dispatch(`${user}/Profile`, null, { root: true });
      }
    },
    Edit: async ({ commit, dispatch }, form) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "edit" });
      const { _id } = router.history.current.params;
      try {
        await axios.post(`/api/request/faculty/update/${_id}`, form, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        dispatch("message/successMessage", "request letter updated", {
          root: true,
        });
        commit("setLoading", { loading: false, type: "edit" });
        router.push(
          form.reports.status === "created"
            ? "/faculty/home/drafts"
            : "/faculty/home/sent"
        );
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "edit" });
        dispatch("message/errorMessage", message, { root: true });
        const user = router.history.current.fullPath.split("/")[1];
        dispatch(`${user}/Profile`, null, { root: true });
      }
    },
    All: async ({ commit, dispatch, state }, user_type = "admin") => {
      if (!state.all[0]) commit("setLoading", { loading: true, type: "all" });
      try {
        const { data } = await axios.get(`/api/request/${user_type}/all`, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "all" });
        commit("setAll", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "all" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    Drafts: async ({ commit, dispatch, state }) => {
      if (!state.drafts[0])
        commit("setLoading", { loading: true, type: "drafts" });
      try {
        const { data } = await axios.get("/api/request/faculty/drafts", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "drafts" });
        commit("setDrafts", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "drafts" });
        dispatch("message/errorMessage", message, { root: true });
        const user = router.history.current.fullPath.split("/")[1];
        dispatch(`${user}/Profile`, null, { root: true });
      }
    },
    Sent: async ({ commit, dispatch, state }) => {
      if (!state.sent[0]) commit("setLoading", { loading: true, type: "sent" });
      try {
        const { data } = await axios.get("/api/request/faculty/sent", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "sent" });
        commit("setSent", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "sent" });
        dispatch("message/errorMessage", message, { root: true });
        const user = router.history.current.fullPath.split("/")[1];
        dispatch(`${user}/Profile`, null, { root: true });
      }
    },
    Archives: async ({ commit, dispatch, state }, user_type) => {
      if (!state.archives[0])
        commit("setLoading", { loading: true, type: "archives" });
      try {
        const { data } = await axios.get(`/api/request/${user_type}/archives`, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "archives" });
        commit("setArchives", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "archives" });
        dispatch("message/errorMessage", message, { root: true });
        const user = router.history.current.fullPath.split("/")[1];
        dispatch(`${user}/Profile`, null, { root: true });
      }
    },
    Pendings: async ({ commit, dispatch, state }, user_type) => {
      if (!state.pendings[0])
        commit("setLoading", { loading: true, type: "pendings" });
      try {
        const { data } = await axios.get(`/api/request/${user_type}/pendings`, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "pendings" });
        commit("setPendings", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "pendings" });
        dispatch("message/errorMessage", message, { root: true });
        const user = router.history.current.fullPath.split("/")[1];
        dispatch(`${user}/Profile`, null, { root: true });
      }
    },
    Signed: async ({ commit, dispatch, state }, user_type) => {
      if (!state.signed[0])
        commit("setLoading", { loading: true, type: "signed" });
      try {
        const { data } = await axios.get(`/api/request/${user_type}/signed`, {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", { loading: false, type: "signed" });
        commit("setSigned", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "signed" });
        dispatch("message/errorMessage", message, { root: true });
        const user = router.history.current.fullPath.split("/")[1];
        dispatch(`${user}/Profile`, null, { root: true });
      }
    },
    Track: async ({ commit, dispatch }, _id) => {
      commit("setLoading", { loading: true, type: "tracked" });
      dispatch("message/defaultState", null, { root: true });
      commit("setTracked", {});
      try {
        const { data } = await axios.get(`/api/request/track/${_id}`);
        commit("setLoading", { loading: false, type: "tracked" });
        commit("setTracked", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "tracked" });
        commit("setTracked", {});
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    DeleteSelected: async ({ commit, getters, dispatch }) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "delete_selected" });
      try {
        await axios.post(
          "/api/request/faculty/delete/selected",
          { delete_selected: getters.getDeleteSelected },
          {
            headers: { Authorization: localStorage.getItem("Authorization") },
          }
        );
        commit("setLoading", { loading: false, type: "delete_selected" });
        commit("setDeleteSelected", []);
        dispatch("message/successMessage", "selected request deleted", {
          root: true,
        });

        dispatch("Drafts");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "delete_selected" });
        commit("setDeleteSelected", []);
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    Send: async ({ commit, dispatch }, _id) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "send" });
      try {
        await axios.post(
          `/api/request/faculty/send/${_id}`,
          {},
          {
            headers: { Authorization: localStorage.getItem("Authorization") },
          }
        );
        dispatch("message/successMessage", "request letter sent", {
          root: true,
        });
        commit("setLoading", { loading: false, type: "send" });

        dispatch("Drafts");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "send" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    Sign: async ({ commit, dispatch }, { _id, form, user_type }) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "sign" });
      try {
        const { signature, remarks } = form;
        await axios.post(
          `/api/request/${user_type}/sign`,
          { _id, signature, remarks },
          {
            headers: { Authorization: localStorage.getItem("Authorization") },
          }
        );

        dispatch("message/successMessage", "request letter signed", {
          root: true,
        });

        commit("setLoading", { loading: false, type: "sign" });
        dispatch("Info", {
          _id,
          user_type: user_type === "provider" ? "faculty" : user_type,
        });
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "sign" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    Mark: async ({ commit, dispatch }, { _id, mark_type }) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { loading: true, type: "mark" });
      try {
        await axios.post(
          `/api/request/faculty/mark/as/${mark_type}/${_id}`,
          {},
          {
            headers: { Authorization: localStorage.getItem("Authorization") },
          }
        );

        dispatch(
          "message/successMessage",
          `request letter mark as ${mark_type}`,
          {
            root: true,
          }
        );
        dispatch("Info", { _id, user_type: "faculty" });
        commit("setLoading", { loading: false, type: "mark" });
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "mark" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    Info: async ({ commit, dispatch }, { _id, user_type }) => {
      try {
        commit("setLoading", { loading: true, type: "info" });
        const { data } = await axios.get(
          `/api/request/${user_type}/info/${_id}`,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        );
        commit("setLoading", { loading: false, type: "info" });
        commit("setInfo", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "info" });
        dispatch("message/errorMessage", message, { root: true });
        const user = router.history.current.fullPath.split("/")[1];
        dispatch(`${user}/Profile`, null, { root: true });
      }
    },
    Reject: async ({ commit, dispatch }, request_id) => {
      commit("setLoading", { loading: true, type: "reject" });

      try {
        await axios.post(
          "/api/request/admin/reject",
          {
            id: request_id,
          },
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        );

        commit("setLoading", { loading: false, type: "reject" });
        dispatch("message/successMessage", "Request Rejected", { root: true });
        dispatch("Info", { _id: request_id, user_type: "admin" });
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { loading: false, type: "info" });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default request;
