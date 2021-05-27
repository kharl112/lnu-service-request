const navigation = {
  namespaced: true,
  state: () => ({ drawer: true, slide_info: false }),
  getters: {
    getDrawer: (state) => state.drawer,
    getSlideInfo: (state) => state.slide_info,
  },
  mutations: {
    setDrawer: (state, drawer) => (state.drawer = drawer),
    setSlideInfo: (state, slide_info) => (state.slide_info = slide_info),
  },
};

export default navigation;
