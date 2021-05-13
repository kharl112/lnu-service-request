import axios from "axios";
import { router } from "../../main";
const token = {
  namespaced: true,
  state: () => ({
    tokens: null,
    error: null,
    loading: false,
  }),
  getters: {
    getTokens: (state) => state.tokens,
    getError: (state) => state.error,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setError: (state, message) => (state.error = message),
    clearError: (state) => (state.error = null),
    setLoading: (state, loading) => (state.loading = loading),
    setTokens: (state, tokens) => (state.tokens = tokens),
  },
  actions: {
    showTokens: async ({ commit }, filter) => {
      commit("clearError");
      commit("setLoading", true);
      try {
        const { data } = await axios.get(`/api/token/${filter}`, {
          headers: { Authorization: sessionStorage.getItem("Authorization") },
        });
        commit("setLoading", false);
        return commit("setTokens", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", false);
        return commit("setError", message);
      }
    },
    claimToken: async ({ commit }, token) => {
      commit("clearError");
      commit("setLoading", true);
      try {
        await axios.post(
          "/api/token/claim",
          { token },
          {
            headers: { Authorization: sessionStorage.getItem("Authorization") },
          }
        );
        commit("setLoading", false);
        return router.replace("/faculty/home/drafts");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", false);
        return commit("setError", message);
      }
    },
  },
};

export default token;
