import axios from "axios";

const role = {
  namespaced: true,
  state: () => ({
    all_roles: [],
    loading: false,
  }),
  getters: {
    getAllRoles: (state) => state.all_roles,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setAllRoles: (state, all_roles) => (state.all_roles = [...all_roles]),
    setLoading: (state, loading) => (state.loading = loading),
  },
  actions: {
    allRoles: async ({ commit, dispatch }) => {
      commit("setLoading", true);
      try {
        const { data } = await axios.get("/api/role/all", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", false);
        return commit("setAllRoles", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", false);
        return dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default role;
