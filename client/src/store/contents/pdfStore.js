import axios from "axios";
import fileDownload from "js-file-download";

const pdf = {
  namespaced: true,
  state: () => ({
    loading: false,
    error: null,
  }),
  getters: {
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
  mutations: {
    setLoading: (state, loading) => (state.loading = loading),
    setError: (state, message) => (state.error = message),
  },
  actions: {
    generatePDF: async ({ commit }, { user_type, id }) => {
      commit("clearError");
      commit("setLoading", message);
      try {
        const { data } = await axios.post(
          `/api/pdf/${user_type}/id=${id}`,
          {},
          {
            responseType: "blob",
            headers: {
              Authorization: sessionStorage.getItem("Authorization"),
            },
          }
        );
        commit("setLoading", false);
        return fileDownload(data, new Date().toString());
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", false);
        return commit("setError", message);
      }
    },
  },
};

export default pdf;
