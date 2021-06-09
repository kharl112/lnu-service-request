<script>
import LeftBg1 from "../../svgs/LeftBg1";
import LeftBg2 from "../../svgs/LeftBg2";
export default {
  name: "Login",
  data() {
    return {
      show: false,
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
      <v-col cols="12" sm="6" md="4" id="login-col2">
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
                <router-link to="/" class="text-decoration-none">
                  <h3
                    :class="
                      `text-h5 text-sm-h4 text-md-h4 ${
                        $vuetify.theme.dark ? 'primary--text' : ''
                      }`
                    "
                  >
                    <strong class="warning--text">LNU</strong>
                    Service Request System
                  </h3>
                </router-link>
              </v-col>
              <v-col cols="12" class="pa-2"><v-divider /></v-col>
              <v-col
                cols="12"
                class="pa-2 pb-5"
                v-if="getUserType === 'faculty'"
              >
                <h4
                  :class="
                    `text-h6 text-sm-h5 text-md-h5 ${
                      $vuetify.theme.dark ? 'primary--text' : ''
                    }`
                  "
                >
                  Head and staff Login
                </h4>
              </v-col>
              <v-col cols="12" class="pa-2  pb-5" v-else>
                <h4
                  :class="
                    `text-h6 text-sm-h5 text-md-h5 ${
                      $vuetify.theme.dark ? 'warning--text' : ''
                    }`
                  "
                >
                  CAO Personnel Login
                </h4>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-form ref="form" @submit="handleSubmit">
              <v-row no-gutters>
                <v-col cols="12" md="11" sm="12">
                  <v-text-field
                    :rules="rules.email"
                    :disabled="getLoading.login"
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
  </v-container>
</template>
<style lang="scss" scoped>
@import "../../../assets/scss/pages/Login/login.scss";
</style>
