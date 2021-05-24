<script>
import SideNav from "./contents/SideNav";
import Header from "./contents/Header";
import ConfirmLogout from "./contents/ConfirmLogout";
export default {
  name: "HomeUser",
  components: {
    SideNav,
    ConfirmLogout,
    Header,
  },
  data: () => ({
    logout: false,
    timeout: 2000
  }),
  computed: {
    getUserProfile() {
      return this.$store.getters["faculty/getProfile"];
    },
    getSuccess() {
      return this.$store.getters["pdf/getSuccess"];
    },
    snackbar: {
      get() {
        return this.$store.getters["pdf/getSnackbar"];
      },
      set(flag) {
        return this.$store.commit("pdf/setSnackbar", flag);
      },
    },
  },
  methods: {
    showLogout() {
      return (this.logout = !this.logout);
    },
  },
  created() {
    return this.$store.dispatch("faculty/userProfile");
  },
};
</script>
<template>
  <v-container fluid class="home-container">
    <v-row no-gutters dense class="home-row1" v-if="getUserProfile">
      <v-col cols="1">
        <SideNav :showLogout="showLogout" />
      </v-col>
      <v-col class="home-col1">
        <v-container fluid class="home-container2">
          <v-row
            justify="end"
            justify-sm="center"
            justify-md="center"
            align="start"
            class="home-row2"
          >
            <v-col cols="12">
              <Header />
            </v-col>
            <v-col cols="11" sm="10" md="12" lg="12">
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
    <v-snackbar :timeout="timeout" color="success" v-model="snackbar">
      {{ getSuccess }}
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
