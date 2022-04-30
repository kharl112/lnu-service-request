import axios from "axios";

const services = {
  namespaced: true,
  state: () => ({
    all_services: [],
    loading: false,
  }),
  getters: {
    getAllServices: (state) => state.all_services,
    getLoading: (state) => state.loading,
  },
  mutations: {
    setAllServices: (state, all_services) =>
      (state.all_services = [...all_services]),
    setLoading: (state, loading) => (state.loading = loading),
  },
  actions: {
    allServices: async ({ commit, dispatch }) => {
      commit("setLoading", true);
      try {
        const { data } = await axios.get("/api/service/all", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        commit("setLoading", false);
        commit("setAllServices", data);
      } catch (error) {
        const { message } = error.response.data || error;
        commit("setLoading", false);
        dispatch("message/errorMessage", message, { root: true });
      }
    },
  },
};

export default services;
