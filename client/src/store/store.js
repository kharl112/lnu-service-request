import faculty from "./contents/userStore";
import admin from "./contents/adminStore";
import token from "./contents/tokenStore";
import request from "./contents/requestStore";
import pdf from "./contents/pdfStore";
import message from "./contents/messageStore";
import navigation from "./contents/navigationStore";
import unit from "./contents/unitStore";
import role from "./contents/roleStore";
import service from "./contents/serviceStore";
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
    navigation,
    unit,
    role,
    service,
  },
});

export default store;
