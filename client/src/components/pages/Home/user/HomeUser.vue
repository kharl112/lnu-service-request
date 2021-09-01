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
    timeout: 2000,
  }),
  computed: {
    getUserProfile() {
      return this.$store.getters["faculty/getProfile"];
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
    navigation: {
      get() {
        return this.$store.getters["navigation/getDrawer"];
      },
      set(drawer) {
        return this.$store.commit("navigation/setDrawer", drawer);
      },
    },
    slide_info: {
      get() {
        return this.$store.getters["navigation/getSlideInfo"];
      },
      set(slide_info) {
        return this.$store.commit("navigation/setSlideInfo", slide_info);
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
  updated() {
    if (!this.navigation && document.cookie !== "slide_info=false") {
      document.cookie = "slide_info=false";
      this.slide_info = true;
    }
  },
};
</script>
<template>
  <v-container fluid class="home-container">
    <v-row no-gutters dense class="home-row1" v-if="getUserProfile">
      <SideNav :showLogout="showLogout" />
      <v-col class="home-col1">
        <v-container fluid class="home-container2">
          <v-row
            justify="end"
            justify-sm="center"
            justify-md="center"
            align="start"
          >
            <v-col cols="12">
              <Header />
            </v-col>
            <v-col cols="12">
              <transition name="slide-right" mode="out-in">
                <router-view></router-view>
              </transition>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row justify="center" v-else>
      <v-col cols="12" align="center" class="pt-16">
        <v-progress-circular :size="50" indeterminate color="primary" />
      </v-col>
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

    <v-snackbar
      :timeout="10000"
      v-show="slide_info"
      color="primary"
      v-model="slide_info"
    >
      You can bring back navigation by sliding right
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="slide_info = false">
          Dismiss
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style lang="scss" scoped>
@import "../../../../assets/scss/pages/Home/home.scss";
</style>
