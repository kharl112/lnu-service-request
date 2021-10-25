import axios from "axios";
import fileDownload from "js-file-download";

const downloadPDF = async (user_type, id) => {
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
  return data;
};

const pdf = {
  namespaced: true,
  state: () => ({
    loading: {
      preview: false,
      download: false,
    },
    blobURL: null,
  }),
  getters: {
    getLoading: (state) => state.loading,
    getBlobURL: (state) => state.blobURL,
  },
  mutations: {
    setLoading: (state, { type, loading }) => (state.loading[type] = loading),
    setBlobURL: (state, blobURL) => (state.blobURL = blobURL),
  },
  actions: {
    generatePDF: async ({ commit, dispatch }, { user_type, id }) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { type: "download", loading: true });
      try {
        const data = await downloadPDF(user_type, id);
        dispatch("message/successMessage", "Download Completed", {
          root: true,
        });
        commit("setLoading", { type: "download", loading: false });
        const date = new Date();
        fileDownload(
          data,
          `${id}_${date.getMonth()}${date.getDate()}${date.getFullYear()}.pdf`
        );
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { type: "download", loading: false });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
    previewPDF: async ({ commit, dispatch }, { user_type, id }) => {
      commit("setBlobURL", null);
      commit("setLoading", { type: "preview", loading: false });
      try {
        const data = await downloadPDF(user_type, id);
        commit("setLoading", { type: "preview", loading: false });
        const pdfFileURL = window.URL.createObjectURL(new Blob([data]));
        commit("setBlobURL", pdfFileURL);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", { type: "preview", loading: false });
        dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default pdf;
