const navigation = {
  namespaced: true,
  state: () => ({ drawer: true }),
  getters: {
    getDrawer: (state) => state.drawer,
  },
  mutations: {
    setDrawer: (state, drawer) => (state.drawer = drawer),
  },
};

export default navigation;
