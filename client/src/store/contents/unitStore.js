import axios from "axios";

const unit = {
  namespaced: true,
  state: () => ({
    all_units: [],
    loading: false,
  }),
  getters: {
    getAllUnits: (state) => state.all_units,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setAllUnits: (state, all_units) => (state.all_units = [...all_units]),
    setLoading: (state, loading) => (state.loading = loading),
  },
  actions: {
    allUnits: async ({ commit, dispatch }) => {
      commit("setLoading", true);
      try {
        const { data } = await axios.get("/api/unit/all", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", false);
        return commit("setAllUnits", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", false);
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default unit;
