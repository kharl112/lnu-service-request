const cookie = {
  namespaced: true,
  state: () => ({ darkmode: false }),
  getters: {
    getDarkmode: (state) => {
      const darkmode = localStorage.getItem("darkmode") === "true";
      return state.darkmode ? state.darkmode : darkmode ? darkmode : false;
    },
  },
  mutations: {
    setDarkmode: (state, darkmode) => {
      localStorage.setItem("darkmode", darkmode);
      return (state.darkmode = darkmode);
    },
  },
};

export default cookie;
