import axios from "axios";

const faculty = {
  namespaced: true,
  state: () => ({
    user: null,
    error: null,
  }),
  getters: {
    getUser: (state) => state.user,
    getError: (state) => state.error,
  },
  mutations: {
    setError: (state, error) => (state.error = error),
  },
  actions: {
    userLogin: async ({ commit }, form) => {
      try {
        const { data } = await axios.post("/api/user/login", form);
        return sessionStorage.setItem("Authorization", data.token);
      } catch (error) {
        return commit("setError", error.response.data.message);
      }
    },
  },
};

export default faculty;
