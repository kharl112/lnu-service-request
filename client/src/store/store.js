import faculty from "./contents/userStore";
import admin from "./contents/adminStore";
import token from "./contents/tokenStore";
import request from "./contents/requestStore";
import pdf from "./contents/pdfStore";
import message from "./contents/messageStore";
import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    faculty,
    admin,
    token,
    request,
    pdf,
    message,
  },
});

export default store;
