import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import { routes } from "./routes/routes";
import store from "./store/store";
import "./registerServiceWorker";
import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(require("vue-pusher"), {
  api_key: "cdf045b877491b8becc2",
  options: {
    cluster: "ap1",
    encrypted: true,
  },
});

export const router = new VueRouter({
  routes,
  mode: "history",
});

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
