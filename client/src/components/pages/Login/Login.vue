<script>
import LeftBg1 from "../../svgs/LeftBg1";
import LeftBg2 from "../../svgs/LeftBg2";
export default {
  name: "Login",
  data() {
    return {
      show: false,
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
  },
  computed: {
    getUserType() {
      return this.$route.params.user_type;
    },
  },
};
</script>
<template>
  <v-container fluid id="login-container">
    <v-row id="login-row1" justify="start" align="start">
      <v-col cols="3" sm="3" class="d-none d-sm-flex" id="login-col1">
        <LeftBg1 v-if="getUserType === 'faculty'" />
        <LeftBg2 v-else />
      </v-col>
      <v-col sm="9" md="4" id="login-col2">
        <v-row justify="start" align="start" id="login-right-row">
          <v-container id="header-container">
            <h3 id="heading" class=" text-h5 text-sm-h5 text-md-h4">
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
              class="text-h6 text-sm-h6 text-md-h5 faculty-color"
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
          <v-form>
            <v-row no-gutters>
              <v-col cols="11">
                <v-text-field
                  class="input"
                  label="Email"
                  type="email"
                  autofocus
                  background-color="#E5E5E5"
                  outlined
                  required
                />
              </v-col>

              <v-col cols="11">
                <v-text-field
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  class="input"
                  label="Password"
                  :type="show ? 'password' : 'text'"
                  background-color="#E5E5E5"
                  @click:append="handleShowPassword"
                  outlined
                  required
                />
              </v-col>
              <v-col cols="11">
                <v-alert class="alert" v-show="false" dense type="error">
                  Invalid
                </v-alert>
              </v-col>

              <v-col cols="11">
                <v-checkbox
                  class="check-box"
                  label="I know what am I doing."
                  color="#e78a00"
                  value="1"
                  hide-details
                  required
                ></v-checkbox>
              </v-col>

              <v-col cols="11">
                <v-btn type="submit" bottom color="primary" block large>
                  Login
                </v-btn>
              </v-col>
              <v-row dense>
                <v-col
                  cols="11"
                  class="links-container"
                  v-show="getUserType === 'faculty'"
                >
                  <router-link
                    v-bind:to="`/${getUserType}/register/step=1`"
                    class="links"
                    >Create Account</router-link
                  >
                </v-col>
                <v-col class="links-container">
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
