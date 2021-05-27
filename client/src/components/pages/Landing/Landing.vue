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
    gotoRegister() {
      return this.$router.push("/faculty/register/step=1");
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
          outlined
          class="pa-8 pa-sm-10 pa-md-12 ma-5 mb-2"
        >
          <v-row justify="center" align="center">
            <h3 class=" text-body1 text-sm-h6 text-md-h5 mb-4">
              <strong class="warning--text">LNU</strong>
              Service Request System
            </h3>
            <v-col cols="12" align="center">
              <v-row justify="center">
                <v-subheader class="text-center">
                  Leyte Normal University service requesting app.
                </v-subheader>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-btn
                elevation="0"
                block
                color="warning"
                :disabled="!deferredPrompt"
                @click="install"
              >
                Get this app
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-row justify="center">
                <v-subheader>
                  Login as
                  <router-link
                    to="/admin/login"
                    class="pl-1 pr-1 text-decoration-none font-weight-bold"
                    >Admin</router-link
                  >
                  or
                  <router-link
                    to="/faculty/login"
                    class="pl-1 pr-1 text-decoration-none font-weight-bold"
                    >User</router-link
                  >
                </v-subheader>
              </v-row>
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
              <v-btn elevation="0" block color="primary" @click="gotoRegister">
                Signup
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
