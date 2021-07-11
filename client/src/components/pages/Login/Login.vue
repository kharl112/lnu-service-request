<script>
import LeftBg1 from "../../svgs/LeftBg1";
import LeftBg2 from "../../svgs/LeftBg2";
export default {
  name: "Login",
  data() {
    return {
      show: false,
      deferredPrompt: null,
      selections: [
        { value: "admin", text: "Chief Administration Office" },
        { value: "faculty", text: "Employee/Faculty" },
      ],
      form: {
        email: "",
        password: "",
      },
      rules: {
        checkBox: [(v) => !!v || "This is required"],
        email: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ],
        password: [
          (v) => !!v || "Password is required",
          (v) => (!!v && v.length >= 8) || "Password must be 8 characters long",
        ],
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
        return this.getUserType === "faculty"
          ? this.$store.dispatch("faculty/userLogin", this.form)
          : this.$store.dispatch("admin/adminLogin", this.form);
      }
    },
    gotoRegister(e) {
      e.preventDefault();
      return this.$router.push(`/${this.getUserType}/register/step=1`);
    },
    async install() {
      if (this.deferredPrompt) this.deferredPrompt.prompt();
    },
    goToLink(link) {
      return this.$router.push(link);
    },
  },
  computed: {
    getUserType() {
      return this.$route.params.user_type;
    },
    getError() {
      return this.$store.getters["message/getError"];
    },
    getLoading() {
      return this.getUserType === "faculty"
        ? this.$store.getters["faculty/getLoading"]
        : this.$store.getters["admin/getLoading"];
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
        <LeftBg1 v-if="getUserType === 'faculty'" />
        <LeftBg2 v-else />
      </v-col>
      <v-col cols="12" sm="7" md="5" lg="4" id="login-col2">
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
                  :class="
                    `text-h5 text-sm-h4 text-md-h4 text-center text-md-left ${
                      $vuetify.theme.dark ? 'primary--text' : ''
                    }`
                  "
                >
                  <strong class="warning--text">LNU</strong>
                  Service Request System
                </h3>
              </v-col>
              <v-col cols="12" class="pa-2"><v-divider /></v-col>
              <v-col cols="11" class="pa-2 pb-0">
                <h4
                  v-if="getUserType === 'faculty'"
                  :class="
                    ` overline font-weight-bold text-center ${
                      $vuetify.theme.dark ? 'primary--text' : ''
                    }`
                  "
                >
                  Faculty Personnel Login
                </h4>
                <h4
                  v-else
                  :class="
                    ` overline font-weight-bold text-center ${
                      $vuetify.theme.dark ? 'warning--text' : ''
                    }`
                  "
                >
                  Chief Admin Office Login
                </h4>
              </v-col>
              <v-col cols="12" md="11" sm="12" class="pb-0">
                <v-select
                  @change="(e) => $router.push(`/${e}/login`)"
                  dense
                  outlined
                  :items="selections"
                  label="Select user level"
                  item-text="text"
                  item-value="value"
                  v-model="getUserType"
                />
              </v-col>
              <v-col cols="12" class="pb-5 pt-0"><v-divider /></v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-form ref="form" @submit="handleSubmit">
              <v-row no-gutters>
                <v-col cols="12" md="11" sm="12">
                  <v-text-field
                    :rules="rules.email"
                    :disabled="getLoading.login"
                    dense
                    class="input"
                    label="E-mail"
                    v-model="form.email"
                    type="email"
                    autofocus
                    outlined
                  />
                </v-col>

                <v-col cols="12" md="11" sm="12">
                  <v-text-field
                    :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                    :rules="rules.password"
                    :type="show ? 'text' : 'password'"
                    :disabled="getLoading.login"
                    dense
                    class="input"
                    label="Password"
                    v-model="form.password"
                    @click:append="handleShowPassword"
                    outlined
                  />
                </v-col>
                <v-col cols="12" md="11" sm="12" class="pa-0">
                  <v-alert class="alert" v-if="getError" dense type="error">
                    {{ getError }}
                  </v-alert>
                </v-col>
                <v-col cols="12" md="11" sm="12">
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
                <v-col cols="12" md="11" sm="12" class="pa-6">
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
                  <v-col cols="12" md="11" sm="12" class="links-container">
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
                  <v-col cols="12">
                    <v-container fluid class="pa-0 pt-3">
                      <router-link
                        :to="`/${getUserType}/forgot/password/step=1`"
                      >
                        I forgot my password
                      </router-link>
                    </v-container>
                  </v-col>
                </v-row>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="floating-button">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            v-bind="attrs"
            v-on="on"
            @click="goToLink('/track/none')"
            color="primary"
            medium
            class="ma-2"
            fab
          >
            <v-icon>mdi-map-marker-distance</v-icon>
          </v-btn>
        </template>
        <span>
          Track request
        </span>
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
              ? "This app is compatible in your device"
              : "This app is not installable in your browser"
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
</style>
