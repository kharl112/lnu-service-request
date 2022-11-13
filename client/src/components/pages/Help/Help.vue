<script>
export default {
  name: "Help",
};
</script>
<template>
  <div>
    <v-app-bar absolute flat light outlined>
      <v-row
        justify="center"
        align="center"
        tag="a"
        href="/login"
        class="text-decoration-none"
      >
        <img
          src="../../../assets/images/logo-512x512.png"
          class="lnusr-logo  pb-3"
          alt="LNU Service Request Logo"
          title="LNU Service Request Logo"
        />
        <span class="ml-2 text-h5 pb-3">
          <span class="warning--text font-weight-bold pa-0"> LNU </span>
          Service Requesting System
        </span>
      </v-row>
      <template v-slot:extension>
        <v-tabs align-with-title>
          <v-tab to="/help/about" >About</v-tab>
          <v-tab to="/help/tutorials">Tutorials</v-tab>
          <v-tab to="/help/privacy-and-policy" style="white-space: pre-wrap">Privacy and Policy</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-container class="mt-16 ma-0" fluid>
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
