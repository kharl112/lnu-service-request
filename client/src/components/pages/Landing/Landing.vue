<script>
export default {
  name: "Landing",
  data() {
    return {
      deferredPrompt: null,
    };
  },
  created() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
  },
  methods: {
    async install() {
      this.deferredPrompt.prompt();
    },
    goToLink(link) {
      return this.$router.push(link);
    },
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pt-5">
    <v-row justify="center" align="center">
      <v-col cols="12" pa="4" justify="center" align="center">
        <v-card
          max-width="400"
          min-width="250"
          outlined
          class="pa-6 pa-sm-8 pa-md-8 ma-5 mb-2"
        >
          <v-row justify="center" align="center">
            <v-col cols="12">
              <v-row justify="center" align="center">
                <v-col md="4" align="center">
                  <v-img
                    max-width="85"
                    min-width="70"
                    src="../../../assets/images/logo-512x512.png"
                  />
                </v-col>
                <v-col cols="12" md="8" class="pb-2">
                  <div
                    class="text-subtitle-1 text-sm-h6 text-center text-md-left primary--text pa-0"
                  >
                    <span class="warning--text font-weight-bold">LNU </span>
                    Service Request System
                  </div>
                  <v-card-subtitle
                    class="caption pa-0 pt-1 text-center text-md-left"
                  >
                    Service Requesting Application
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-divider />
            </v-col>
            <v-col cols="12">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    elevation="0"
                    block
                    color="warning"
                    :disabled="!deferredPrompt"
                    @click="install"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon left>
                      mdi-download
                    </v-icon>
                    Get this app
                  </v-btn>
                </template>
                <span>{{
                  deferredPrompt
                    ? "This app is compatible in your device"
                    : "This app is not compatible in your device"
                }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="12">
              <v-card-subtitle class="pa-0 font-weight-bold">
                Quick Links
              </v-card-subtitle>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-card-actions>
                <v-row justify="start">
                  <v-btn
                    block
                    elevation="0"
                    @click="goToLink('/track/none')"
                    class="caption mt-2"
                  >
                    <v-icon left color="primary">
                      mdi-map-marker-distance
                    </v-icon>
                    Track Request
                  </v-btn>
                  <v-btn
                    block
                    elevation="0"
                    @click="goToLink('/admin/login')"
                    class="caption mt-2"
                  >
                    <v-icon left color="primary">mdi-account</v-icon>
                    Chief Administration Office
                  </v-btn>
                  <v-btn
                    block
                    elevation="0"
                    @click="goToLink('/faculty/login')"
                    class="caption mt-2"
                  >
                    <v-icon left color="primary">mdi-account-supervisor</v-icon>
                    Employee's Portal
                  </v-btn>
                </v-row>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
