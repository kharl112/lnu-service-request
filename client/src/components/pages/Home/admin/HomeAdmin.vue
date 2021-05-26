<script>
import SideNav from "./contents/SideNav";
import Header from "./contents/Header";
import ConfirmLogout from "./contents/ConfirmLogout";
export default {
  name: "HomeAdmin",
  components: {
    SideNav,
    ConfirmLogout,
    Header,
  },
  data: () => ({
    logout: false,
    timeout: 2000,
  }),
  computed: {
    getAdminProfile() {
      return this.$store.getters["admin/getProfile"];
    },
    getSuccess() {
      return this.$store.getters["message/getSuccess"];
    },
    getError() {
      return this.$store.getters["message/getError"];
    },
    snackbar: {
      get() {
        return this.$store.getters["message/getSnackbar"];
      },
      set(flag) {
        return this.$store.commit("message/setSnackbar", flag);
      },
    },
  },
  methods: {
    showLogout() {
      return (this.logout = !this.logout);
    },
  },
  created() {
    return this.$store.dispatch("admin/adminProfile");
  },
};
</script>
<template>
  <v-container fluid class="home-container">
    <v-row no-gutters dense class="home-row1" v-if="getAdminProfile">
      <SideNav :showLogout="showLogout" />
      <v-col class="home-col1">
        <v-container fluid class="home-container2">
          <v-row
            justify="end"
            justify-sm="center"
            align="start"
            class="home-row2"
          >
            <v-col cols="12">
              <Header />
            </v-col>
            <v-col cols="12" class="pa-3 pl-16">
              <transition name="slide-right" mode="out-in">
                <router-view></router-view>
              </transition>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row id="spinner-container" justify="center" align="center" v-else>
      <v-progress-circular
        :size="50"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-row>
    <ConfirmLogout :logout="logout" :showLogout="showLogout" />
    <v-snackbar
      :timeout="timeout"
      v-show="getSuccess"
      color="success"
      v-model="snackbar"
    >
      {{ getSuccess }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      :timeout="timeout"
      v-show="getError"
      color="error"
      v-model="snackbar"
    >
      {{ getError }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style lang="scss" scoped>
@import "../../../../assets/scss/pages/Home/home.scss";
</style>
