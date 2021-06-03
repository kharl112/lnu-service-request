<script>
export default {
  name: "ForgotPassword",
};
</script>
<template>
  <v-container id="container" fluid>
    <v-row id="row" justify="center" align="center">
      <v-col cols="12" align-self="center" align="center">
        <transition name="slide" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
@import "../../../assets/scss/pages/Register/register.scss";
#container {
  width: 100vw;
  height: 100vh;
  #row {
    width: 100vw;
    height: 100%;
  }
}
</style>
