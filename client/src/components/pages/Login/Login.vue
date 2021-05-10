<script>
import LeftBg1 from "../../svgs/LeftBg1";
import LeftBg2 from "../../svgs/LeftBg2";
export default {
  name: "Login",
  components: {
    LeftBg1,
    LeftBg2,
  },
  computed: {
    getUserType() {
      return this.$route.params.user_type;
    },
  },
};
</script>
<template>
  <v-container fluid id="login-container">
    <v-row dense no-gutters id="login-row1">
      <v-col cols="3" id="login-col1">
        <LeftBg1 v-if="getUserType === 'faculty'" />
        <LeftBg2 v-else />
      </v-col>
      <v-col cols="9" id="login-col2"> </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
@import "../../../assets/scss/pages/Login/login.scss";
@import "../../../assets/scss/__var.scss";
</style>
