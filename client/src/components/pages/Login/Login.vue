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
  },
  computed: {
    getUserType() {
      return this.$route.params.user_type;
    },
    getError() {
      return this.getUserType === "faculty"
        ? this.$store.getters["faculty/getError"]
        : this.$store.getters["admin/getError"];
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
    <v-row id="login-row1" justify="start" align="start">
      <v-col sm="3" md="3" class="d-none d-sm-flex" id="login-col1">
        <LeftBg1 v-if="getUserType === 'faculty'" />
        <LeftBg2 v-else />
      </v-col>
      <v-col sm="9" md="4" id="login-col2">
        <v-row
          justify-md="start"
          align-md="start"
          justify-sm="center"
          align-sm="center"
          id="login-right-row"
        >
          <v-container id="header-container">
            <h3 id="heading" class=" text-h5 text-sm-h4 text-md-h4">
              <em
                v-bind:class="
                  getUserType === 'faculty' ? 'faculty-color' : 'admin-color'
                "
                >LNU</em
              >
              Service Request System
            </h3>
            <h4
              id="heading2a"
              class="text-h6 text-sm-h5 text-md-h5 faculty-color"
              v-if="getUserType === 'faculty'"
            >
              Head and staff Login
            </h4>
            <h4
              id="heading2b"
              class=" text-h6 text-sm-h6 text-md-h5 admin-color"
              v-else
            >
              Administrator Login
            </h4>
          </v-container>
          <v-form ref="form" @submit="handleSubmit">
            <v-row no-gutters>
              <v-col cols="12" md="11" sm="12">
                <v-text-field
                  :rules="rules.email"
                  :disabled="getLoading.login"
                  class="input"
                  label="E-mail"
                  background-color="#E5E5E5"
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
                  background-color="#E5E5E5"
                  v-model="form.password"
                  @click:append="handleShowPassword"
                  outlined
                />
              </v-col>
              <v-col cols="12" md="11" sm="12">
                <v-alert class="alert" v-if="getError.login" dense type="error">
                  {{ getError.login }}
                </v-alert>
              </v-col>

              <v-col cols="12" md="11" sm="12">
                <v-checkbox
                  class="check-box"
                  :rules="rules.checkBox"
                  label="I know what am I doing."
                  color="#e78a00"
                  value="1"
                  hide-details
                ></v-checkbox>
              </v-col>

              <v-col cols="12" md="11" sm="12">
                <v-btn
                  type="submit"
                  bottom
                  color="primary"
                  :disabled="getLoading.login"
                  block
                  large
                >
                  Login
                </v-btn>
              </v-col>
              <v-row dense>
                <v-col
                  cols="12"
                  md="11"
                  sm="12"
                  class="links-container"
                  v-show="getUserType === 'faculty'"
                >
                  <router-link
                    v-bind:to="`/${getUserType}/register/step=1`"
                    class="links"
                    >Create Account</router-link
                  >
                </v-col>
                <v-col cols="12" md="11" sm="12" class="links-container">
                  <router-link
                    v-bind:to="
                      `/${
                        getUserType === 'faculty' ? 'admin' : 'faculty'
                      }/login`
                    "
                    class="links"
                    >I'm not an {{ getUserType }} member</router-link
                  >
                </v-col>
              </v-row>
            </v-row>
          </v-form>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
@import "../../../assets/scss/pages/Login/login.scss";
</style>
