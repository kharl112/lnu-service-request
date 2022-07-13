<script>
export default {
  name: "About",
};
</script>
<template>
  <div>
    <v-app-bar
      absolute
      color="#1976d2"
      dark
      src="https://picsum.photos/1920/1080?random"
      fade-img-on-scroll
      scroll-target="#scrolling-techniques-3"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, #1976d2 , rgba(25,32,72,.7)"
        ></v-img>
      </template>
      <v-row justify="center" align="center">
        <img
          src="../../../assets/images/logo-512x512.png"
          class="lnusr-logo"
          alt="LNU Service Request Logo"
          title="LNU Service Request Logo"
        />
        <span class="ml-2 text-h5">
          <span class="warning--text font-weight-bold pa-0"> LNU </span>
          Service Requesting System
        </span>
      </v-row>
      <template v-slot:extension>
        <v-tabs align-with-title>
          <v-tab to="/about">About</v-tab>
          <v-tab to="/about/tutorials">Tutorials</v-tab>
          <v-tab to="/about/privacy-and-policy">Privacy and Policy</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-container class="mt-16 ma-0">
      <router-view></router-view>
    </v-container>
  </div>
</template>
<style scoped>
.lnusr-logo {
  width: 4rem;
  height: auto;
  margin-bottom: -5px;
  margin-right: 5px;
}
</style>
