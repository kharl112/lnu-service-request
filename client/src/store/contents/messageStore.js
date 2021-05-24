const message = {
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
};
