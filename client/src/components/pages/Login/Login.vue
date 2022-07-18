<script>
import LeftBg1 from "../../svgs/LeftBg1";
import LeftBg2 from "../../svgs/LeftBg2";
export default {
  name: "Login",
  data() {
    return {
      show: false,
      deferredPrompt: null,
      user: "faculty",
      selections: [
        { value: "admin", text: "Chief Administration Officer" },
        { value: "faculty", text: "Employee/Faculty/Personnel" },
      ],
      form: {
        email: "",
        password: "",
      },
    };
  },
  components: {
    LeftBg1,
    LeftBg2,
  },
  methods: {
    handleShowPassword() {
      return (this.show = !this.show);
    },
    handleSubmit(e) {
      e.preventDefault();
      if (this.$refs.form.validate()) {
        this.$store.dispatch(`${this.user}/Login`, this.form);
      }
    },
    gotoRegister(e) {
      e.preventDefault();
      return this.$router.push(`/register/${this.user}/step=1`);
    },
    async install() {
      if (this.deferredPrompt) this.deferredPrompt.prompt();
    },
    goToLink(link) {
      return this.$router.push(link);
    },
  },
  computed: {
    getError() {
      return this.$store.getters["message/getError"];
    },
    getLoading() {
      return this.$store.getters[`${this.user}/getLoading`];
    },
  },
  created() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });

    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });

    this.$store.dispatch("message/defaultState", null);
  },
};
</script>
<template>
  <v-container fluid id="login-container">
    <v-row
      id="login-row1"
      justify="center"
      align="center"
      justify-sm="start"
      align-sm="start"
      justify-md="start"
      align-md="start"
      class="pt-6 pa-sm-0"
    >
      <v-col sm="2" md="3" class="d-none d-sm-flex pa-0 ma-0">
        <LeftBg1 v-if="user === 'faculty'" />
        <LeftBg2 v-else />
      </v-col>
      <v-col cols="12" sm="10" md="5" lg="4" id="login-col2">
        <v-row
          justify="center"
          align="start"
          justify-sm="start"
          align-sm="center"
          justify-md="start"
          align-md="start"
          dense
          class="pa-5 pl-md-10"
        >
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <h3
                  :class="`text-h2 text-center ${
                    $vuetify.theme.dark ? 'primary--text' : ''
                  }`"
                >
                  <v-container fluid class="mb-5">
                    <v-row justify="center" align-items="center">
                      <img
                        src="../../../assets/images/logo-512x512.png"
                        class="lnu-logo"
                        alt="LNU logo"
                        title="Leyte Normal University logo"
                      />
                      <strong class="primary--text">LNU</strong>
                    </v-row>
                  </v-container>
                  <p class="pa-0 text-h6 mb-3">
                    SERVICE REQUESTING APPLICATION
                  </p>
                </h3>
              </v-col>
              <v-col cols="12" class="pa-2"><v-divider /></v-col>
              <v-col cols="12" class="pa-2 pb-0">
                <h4
                  v-if="user === 'faculty'"
                  :class="` overline font-weight-bold text-center ${
                    $vuetify.theme.dark ? 'primary--text' : ''
                  }`"
                >
                  Logging in as
                  <v-tooltip bottom color="warning">
                    <template v-slot:activator="{ on, attrs }">
                      <span
                        class="text-decoration-underline"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Faculty Personnel
                      </span>
                    </template>
                    <span>Requestors of services</span>
                  </v-tooltip>
                </h4>
                <h4
                  v-else
                  :class="` overline font-weight-bold text-center ${
                    $vuetify.theme.dark ? 'warning--text' : ''
                  }`"
                >
                  Logging in as
                  <v-tooltip bottom color="primary">
                    <template v-slot:activator="{ on, attrs }">
                      <span
                        class="text-decoration-underline"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Chief Administration Officer
                      </span>
                    </template>
                    <span>Authorize Person to approve requests</span>
                  </v-tooltip>
                </h4>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-select
                  @change="() => $store.dispatch('message/defaultState', null)"
                  outlined
                  :items="selections"
                  label="Select user type"
                  item-text="text"
                  item-value="value"
                  v-model="user"
                />
              </v-col>
              <v-col cols="12" class="pb-5 pt-0"><v-divider /></v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-form ref="form" @submit="handleSubmit">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-text-field
                    :disabled="getLoading.login && getLoading.profile"
                    prepend-inner-icon="mdi-email"
                    dense
                    class="input"
                    label="Type your E-mail"
                    v-model="form.email"
                    type="email"
                    autofocus
                    outlined
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                    prepend-inner-icon="mdi-lock"
                    :type="show ? 'text' : 'password'"
                    :disabled="getLoading.login && getLoading.profile"
                    dense
                    class="input"
                    label="Type your Password"
                    v-model="form.password"
                    @click:append="handleShowPassword"
                    outlined
                  />
                </v-col>
                <v-col cols="12" class="pa-0">
                  <v-alert class="alert" v-if="getError" dense type="error">
                    {{ getError }}
                  </v-alert>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    type="submit"
                    bottom
                    color="primary"
                    elevation="0"
                    :disabled="getLoading.login"
                    :loading="getLoading.login"
                    block
                    medium
                  >
                    Login
                  </v-btn>
                </v-col>
                <v-col cols="12" class="pa-6">
                  <v-row justify="center" align="center">
                    <v-col cols="5">
                      <v-divider />
                    </v-col>
                    <v-col cols="2">
                      <v-row justify="center" align="center">
                        <small class="text-center">or</small>
                      </v-row>
                    </v-col>
                    <v-col cols="5">
                      <v-divider />
                    </v-col>
                  </v-row>
                </v-col>

                <v-row dense>
                  <v-col cols="12">
                    <v-btn
                      type="none"
                      bottom
                      color="warning"
                      elevation="0"
                      @click="gotoRegister"
                      block
                      medium
                    >
                      Create Account
                    </v-btn>
                  </v-col>
                </v-row>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="d-none d-sm-none d-md-flex">
        <v-container fluid class="pa-12 mt-14">
          <v-row justify="start" align-items="center">
            <h2 class="text-h5 text-sm-h5 text-md-h3 font-weight-bold mb-5">
              Request Services on the GO!
            </h2>
            <p class="text-body text-sm-body text-md-h6">
              Requesting Services in
              <a
                href="https://www.lnu.edu.ph"
                target="_blank"
                class="font-weight-bold text-decoration-none primary--text"
                title="Go to LNU website"
              >
                Leyte Normal University <strong>(LNU)</strong>
                <v-icon color="primary">mdi-link</v-icon>
              </a>
              made easier. Install LNU Service Request App to your desktop and
              mobile devices to request services on the go.
            </p>
          </v-row>
          <v-row class="mt-5">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  @click="goToLink('/track')"
                  color="primary"
                  medium
                  class="mr-2"
                  elevation="0"
                >
                  <v-icon>mdi-map-marker-distance</v-icon>
                  Track Request
                </v-btn>
              </template>
              <span> Track your request using QR or code</span>
            </v-tooltip>
            <v-tooltip top v-if="deferredPrompt">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  @click="install"
                  :color="deferredPrompt ? 'error' : 'grey lighten-1'"
                  medium
                  class="ml-2"
                  elevation="0"
                >
                  <v-icon>mdi-download</v-icon>
                  Install The App
                </v-btn>
              </template>
              <span> Install this app in your device </span>
            </v-tooltip>
          </v-row>
          <v-row justify="space-between">
            <v-col sm="12" md="8" class="mt-14">
              <v-row justify="space-between">
                <a
                  href="/help/about"
                  class="text-decoration-underline caption font-weight-bold"
                  title="See about page"
                >
                  About
                </a>
                <a
                  href="/help/privacy-and-policy#privacy_notice"
                  class="text-decoration-underline caption font-weight-bold"
                  title="privacy and policy page"
                >
                  Privacy and Policy
                </a>
                <a
                  href="/help/tutorials"
                  class="text-decoration-underline caption font-weight-bold"
                  title="Explore more tutorials"
                >
                  Tutorials
                </a>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row class="floating-button d-flex d-sm-flex d-md-none">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            v-bind="attrs"
            v-on="on"
            @click="goToLink('/track')"
            color="primary"
            medium
            class="ma-2"
            fab
          >
            <v-icon>mdi-map-marker-distance</v-icon>
          </v-btn>
        </template>
        <span> Track request </span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            v-bind="attrs"
            v-on="on"
            @click="install"
            :color="deferredPrompt ? 'error' : 'grey lighten-1'"
            medium
            class="ma-2"
            fab
          >
            <v-icon v-if="deferredPrompt">mdi-download</v-icon>
            <v-icon v-else>mdi-download-off</v-icon>
          </v-btn>
        </template>
        <span>
          {{
            deferredPrompt
              ? "Install the app"
              : "This app is not available for installation in your device"
          }}
        </span>
      </v-tooltip>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
@import "../../../assets/scss/pages/Login/login.scss";
.floating-button {
  position: fixed;
  bottom: 12px;
  right: 12px;
}
.lnu-logo {
  width: 5rem;
  height: auto;
  margin-top: -10px;
  margin-right: 5px;
}
</style>
