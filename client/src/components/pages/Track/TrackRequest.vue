<script>
export default {
  name: "TrackRequest",
};
</script>
<template>
  <v-container fluid class="register-main-container">
    <v-row no-gutters dense justify="center" align="center">
      <v-col sm="9" md="4">
        <v-row justify="center" align="center">
          <v-col md="4" class="hidden-sm-and-down" align="center">
            <v-img
              max-width="100"
              min-width="70"
              src="../../../assets/images/logo-512x512.png"
            />
          </v-col>
          <v-col cols="12" md="8" class="pb-2">
            <router-link to="/" class="text-decoration-none">
              <h3
                class="text-h5 text-sm-h4 text-md-h5 text-center text-md-left primary--text"
              >
                <em>LNU</em>
                Service Request System
              </h3>
            </router-link>
          </v-col>
        </v-row>

        <v-row>
          <v-container> </v-container>
        </v-row>
        <v-row justify="space-between" class="footer-row">
          <router-link class="subtitle-2" to="/">
            Home
          </router-link>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
