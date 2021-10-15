import axios from "axios";
const gdrive = {
  namespaced: true,
  state: () => ({
    loading: {
      upload: false,
    },
  }),
  getters: {
    getLoading: (state) => state.loading,
  },
  mutations: {
    setLoading: (state, { type, loading }) => (state.loading[type] = loading),
  },
  actions: {
    UploadFile: async (
      { commit, dispatch },
      { form_ref, file, request_id, user_type }
    ) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { type: "upload", loading: true });
      try {
        const formData = new FormData(form_ref);
        formData.append("file", file);
        formData.append("directory", request_id);
        const { data } = await axios({
          method: "post",
          url: `/api/${user_type}/drive/upload/file`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("Authorization"),
          },
        });

        commit("setLoading", { type: "upload", loading: false });
        dispatch("message/successMessage", data.message, {
          root: true,
        });
      } catch (error) {
        commit("setLoading", { type: "upload", loading: false });
        dispatch(
          "message/errorMessage",
          "something went wrong, pls try again",
          { root: true }
        );
      }
    },
  },
};

export default gdrive;
