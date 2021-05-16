import faculty from "./contents/userStore";
import admin from "./contents/adminStore";
import token from "./contents/tokenStore";
import request from "./contents/requestStore";
import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    faculty,
    admin,
    token,
    request,
  },
});

export default store;
