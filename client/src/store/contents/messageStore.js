const message = {
  namespaced: true,
  state: () => ({
    error: null,
    success: null,
    snackbar: false,
  }),
  getters: {
    getError: (state) => state.error,
    getSuccess: (state) => state.success,
    getSnackbar: (state) => state.snackbar,
  },
  mutations: {
    setError: (state, message) => (state.error = message),
    setSnackbar: (state, snackbar) => (state.snackbar = snackbar),
    setSuccess: (state, message) => (state.success = message),
  },
  actions: {
    defaultState: ({ commit }) => {
      commit("setError", null);
      commit("setSuccess", null);
      commit("setSnackbar", false);
    },
    successMessage: ({ commit }, message) => {
      commit("setSuccess", message);
      commit("setSnackbar", true);
    },
    errorMessage: ({ commit }, message) => {
      commit("setError", message);
      commit("setSnackbar", true);
    },
  },
};
export default message;
