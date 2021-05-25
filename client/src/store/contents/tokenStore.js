import axios from "axios";
import { router } from "../../main";
const token = {
  namespaced: true,
  state: () => ({
    tokens: null,
    loading: false,
  }),
  getters: {
    getTokens: (state) => state.tokens,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setLoading: (state, loading) => (state.loading = loading),
    setTokens: (state, tokens) => (state.tokens = tokens),
  },
  actions: {
    showTokens: async ({ commit, dispatch }, filter) => {
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
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    generateToken: async ({ commit, dispatch }) => {
      commit("clearError");
      commit("setLoading", true);
      try {
        await axios.post(
          "/api/token/create",
          {},
          {
            headers: { Authorization: sessionStorage.getItem("Authorization") },
          }
        );
        dispatch("message/successMessage", "new token generated", {
          root: true,
        });
        return dispatch("showTokens", "all");
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", false);
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
    claimToken: async ({ commit, dispatch }, token) => {
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
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default token;
