<script>
export default {
  name: "Help",
  methods: {
    back() {
      this.$router.push("/");
    },
  },
};
</script>
<template>
  <div>
    <v-app-bar absolute flat light outlined>
      <v-row justify="start" align="center" class="text-decoration-none">
        <v-col cols="12" class="py-0">
          <v-row justify="center" align="center">
            <v-btn
              icon
              @click="back()"
              style="position: absolute; left: 5px; top: 7px"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <span
              class="ml-5 text-md-h5 text-center text-sm-body primary--text hidden-sm-and-down"
            >
              <span class="warning--text font-weight-bold pa-0"> LNU </span>
              Service Requesting System
            </span>
          </v-row>
        </v-col>
      </v-row>
      <template v-slot:extension>
        <v-tabs
          align-with-title
          style="display: flex; flex-direction: row; justify-content: center"
          class="pr-15 pr-sm-0"
        >
          <v-tab to="/help/about">About</v-tab>
          <v-tab to="/help/tutorials">Tutorials</v-tab>
          <v-tab to="/help/privacy-and-policy" style="white-space: pre-wrap"
            >Privacy and Policy</v-tab
          >
          <v-tab to="/help/download-forms" style="white-space: pre-wrap"
            >Downloadable Forms</v-tab
          >
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
