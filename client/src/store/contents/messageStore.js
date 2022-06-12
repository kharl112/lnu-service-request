const message = {
  namespaced: true,
  state: () => ({
    error: null,
    success: null,
    notification: null,
    notif_bar: false,
    snackbar: false,
  }),
  getters: {
    getError: (state) => state.error,
    getSuccess: (state) => state.success,
    getSnackbar: (state) => state.snackbar,
    getNotifBar: (state) => state.notif_bar,
    getNotification: (state) => state.notification,
  },
  mutations: {
    setError: (state, message) => (state.error = message),
    setSnackbar: (state, snackbar) => (state.snackbar = snackbar),
    setNotifBar: (state, notif_bar) => (state.notif_bar = notif_bar),
    setSuccess: (state, message) => (state.success = message),
    setNotification: (state, options) => (state.notification = options),
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
    notify: ({ commit }, options) => {
      commit("setNotification", options);
      commit("setNotifBar", true);
    },
  },
};
export default message;
