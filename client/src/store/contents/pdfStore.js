import axios from "axios";
import fileDownload from "js-file-download";

const pdf = {
  namespaced: true,
  state: () => ({
    loading: false,
    error: null,
    success: null,
    snackbar: false,
  }),
  getters: {
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getSuccess: (state) => state.sucess,
    getSnackbar: (state) => state.snackbar,
  },
  mutations: {
    setLoading: (state, loading) => (state.loading = loading),
    setError: (state, message) => (state.error = message),
    setSnackbar: (state, snackbar) => (state.snackbar = snackbar),
    setSuccess: (state, message) => (state.sucess = message),
  },
  actions: {
    generatePDF: async ({ commit }, { user_type, id }) => {
      commit("setError", null);
      commit("setLoading", true);
      try {
        const { data } = await axios.post(
          `/api/pdf/${user_type}/create/id=${id}`,
          {},
          {
            responseType: "blob",
            headers: {
              Authorization: sessionStorage.getItem("Authorization"),
            },
          }
        );
        commit("setSnackbar", true);
        commit("setSuccess", "download completed");
        commit("setLoading", false);
        return fileDownload(data, `${new Date().toString()}.pdf`);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", false);
        return commit("setError", message);
      }
    },
  },
};

export default pdf;
