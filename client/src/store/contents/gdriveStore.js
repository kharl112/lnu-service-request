import axios from "axios";
const gdrive = {
  namespaced: true,
  state: () => ({
    upload_percent: 0,
    loading: {
      upload: false,
    },
  }),
  getters: {
    getLoading: (state) => state.loading,
    getUploadPercent: (state) => state.upload_percent,
  },
  mutations: {
    setLoading: (state, { type, loading }) => (state.loading[type] = loading),
    setUploadPercent: (state, percent) => (state.upload_percent = percent),
  },
  actions: {
    UploadFile: async (
      { commit, dispatch },
      { form_ref, file, request_id, user_type }
    ) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", { type: "upload", loading: true });
      commit("setUploadPercent", 0);

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
          onUploadProgress: (event) => {
            const { loaded, total } = event;
            commit("setUploadPercent", Math.floor((loaded * 100) / total));
          },
        });

        commit("setLoading", { type: "upload", loading: false });
        commit("setUploadPercent", 0);

        dispatch(
          "request/Info",
          {
            _id: request_id,
            user_type: user_type === "user" ? "faculty" : user_type,
          },
          { root: true }
        );
        dispatch("message/successMessage", data.message, {
          root: true,
        });
      } catch (error) {
        commit("setLoading", { type: "upload", loading: false });
        commit("setUploadPercent", 0);

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
