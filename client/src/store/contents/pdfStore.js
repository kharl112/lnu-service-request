import axios from "axios";
import fileDownload from "js-file-download";

const pdf = {
  namespaced: true,
  state: () => ({
    loading: false,
  }),
  getters: {
    getLoading: (state) => state.loading,
  },
  mutations: {
    setLoading: (state, loading) => (state.loading = loading),
  },
  actions: {
    generatePDF: async ({ commit, dispatch }, { user_type, id }) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", true);
      try {
        const { data } = await axios.post(
          `/api/pdf/${user_type}/create/id=${id}`,
          {},
          {
            responseType: "blob",
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        );
        dispatch("message/successMessage", "Download Completed", {
          root: true,
        });
        commit("setLoading", false);
        const date = new Date();
        return fileDownload(
          data,
          `${id}_${date.getMonth()}${date.getDate()}${date.getFullYear()}.pdf`
        );
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", false);
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default pdf;
