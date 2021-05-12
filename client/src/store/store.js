import faculty from "./contents/userStore";
import admin from "./contents/adminStore";
import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    faculty,
    admin,
  },
});

export default store;
