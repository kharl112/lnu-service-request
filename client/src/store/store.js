import faculty from "./contents/userStore";
import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    faculty,
  },
});

export default store;
