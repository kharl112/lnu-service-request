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
  }),
  computed: {
    getUserProfile() {
      return this.$store.getters["faculty/getProfile"];
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
            align="stretch"
            class="home-row2"
          >
            <v-col cols="12">
              <Header />
            </v-col>
            <v-col cols="11" sm="12">
              <router-view></router-view>
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
  </v-container>
</template>

<style lang="scss" scoped>
@import "../../../../assets/scss/pages/Home/home.scss";
</style>
