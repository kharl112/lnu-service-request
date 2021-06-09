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
    gotoLogin(userType) {
      return this.$router.push(`/${userType}/login`);
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
          class="pa-8 pa-sm-10 pa-md-12 ma-5 mb-2"
        >
          <v-row justify="center" align="center">
            <v-col cols="12">
              <v-row justify="center" align="center">
                <v-col>
                  <v-img
                    max-width="75"
                    min-width="70"
                    src="../../../assets/images/logo-512x512.png"
                  />
                </v-col>
                <v-col cols="12" md="8">
                  <h3
                    class=" text-body1 text-sm-h6 text-md-h5 mb-4 text-center text-md-left"
                  >
                    <strong class="warning--text">LNU</strong>
                    Service Request System
                  </h3>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" align="center">
              <v-row justify="center">
                <v-subheader class="text-center">
                  Leyte Normal University Service Requesting Application
                </v-subheader>
              </v-row>
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
            <v-col cols="12" align="center" class="pa-2">
              <v-row justify="center">
                <v-subheader class="text-center">
                  Login As
                </v-subheader>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-btn
                elevation="0"
                block
                small
                color="primary"
                @click="gotoLogin('admin')"
              >
                CAO Personnel
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-row justify="center" align="center">
                <v-col cols="5">
                  <v-divider />
                </v-col>
                <v-col cols="2">
                  <v-row justify="center" align="center">
                    <small class="text-center">OR</small>
                  </v-row>
                </v-col>
                <v-col cols="5">
                  <v-divider />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-btn
                elevation="0"
                block
                small
                color="warning"
                @click="gotoLogin('faculty')"
              >
                University Personnel
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
