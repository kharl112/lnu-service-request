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
    claimToken: async ({ commit, dispatch }, { token, userType }) => {
      dispatch("message/defaultState", null, { root: true });
      commit("setLoading", true);
      try {
        const { user_type } = router.history.current.params;
        await axios.post(
          `/api/token/${userType}/claim`,
          { token },
          {
            headers: { Authorization: localStorage.getItem("Authorization") },
          }
        );
        commit("setLoading", false);
        return router.replace(`/${user_type}/login`);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", false);
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default token;
