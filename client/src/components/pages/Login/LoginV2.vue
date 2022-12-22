<script>
// import LeftBg1 from "../../svgs/LeftBg1";
// import LeftBg2 from "../../svgs/LeftBg2";
import GoogleLogin from "vue-google-login";
export default {
  name: "Login",
  data: () => ({
    //install
    show: false,
    deferredPrompt: null,
    //usertype
    user: "faculty",
    //login-form
    form: {
      email: "",
      password: "",
    },
  }),
  components: {
    GoogleLogin,
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
  <v-container fluid class="main-container">
    <v-row
      justify="center"
      justify-sm="center"
      justify-md="start"
      class="main-container-row"
    >
      <v-col cols="12" sm="6" md="4" class="left-container">
        <v-container fluid class="pa-3 pa-sm-5 pa-md-10">
          <v-row justify="start">
            <v-col cols="12" class="d-none d-sm-block">
              <v-row justify-sm="start" align="center">
                <img
                  src="../../../assets/images/logo-512x512.png"
                  class="lnu-logo"
                  alt="LNUSR logo"
                  title="LNUSR logo"
                />
                <h1 class="primary--text app-name">LNUSR</h1>
              </v-row>
            </v-col>
            <v-col cols="12">
              <p class="text-h6 text-sm-h5 d-none d-sm-block">
                Hi, Welcome Back to Staff's Portal
              </p>
              <v-row justify="center" justify-md="start">
                <v-col cols="12" class="hidden-sm-and-up">
                  <v-row justify="center" justify-md="start">
                    <v-col cols="12" class="px-0 pt-0">
                      <v-row justify="center">
                        <img
                          src="../../../assets/images/logo-512x512.png"
                          class="lnu-logo"
                          alt="LNUSR logo"
                          title="LNUSR logo"
                        />
                      </v-row>
                    </v-col>
                    <p class="primary--text overline font-weight-bold app-name">
                      LNUSR
                    </p>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <p class="text-caption text-sm-body text-center text-sm-left">
                    Sign in to continue
                  </p>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <GoogleLogin
                :params="{
                  client_id:
                    '426790513527-2488sq4eltf5nmm7n06ob8j059q42aq2.apps.googleusercontent.com',
                }"
                style="width: 100%"
              >
                <v-btn outlined block large color="secondary">
                  <v-icon left>mdi-google</v-icon>
                  Sign in with google
                </v-btn>
              </GoogleLogin>
            </v-col>

            <v-col cols="12 text-center font-weight-bold"> OR </v-col>

            <v-col cols="12">
              <v-form ref="form" @submit="handleSubmit">
                <v-row justify="start">
                  <v-col cols="12">
                    <v-text-field
                      :disabled="getLoading.login && getLoading.profile"
                      v-model="form.email"
                      label="Email"
                      placeholder="johndoe@example.com"
                      outlined
                      prepend-inner-icon="mdi-email"
                      hide-details
                      tabindex="1"
                      autofocus
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :disabled="getLoading.login && getLoading.profile"
                      :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="show ? 'text' : 'password'"
                      v-model="form.password"
                      @click:append="handleShowPassword"
                      label="Password"
                      outlined
                      prepend-inner-icon="mdi-lock"
                      tabindex="2"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" class="mt-0 pt-0">
                    <span class="error--text caption font-weight-bold text-capitalize"> {{ getError }}</span>
                  </v-col>
                  <v-col cols="12" class="pt-0">
                    <v-btn
                      type="submit"
                      block
                      elevation="0"
                      large
                      color="primary"
                      tabindex="3"
                      :disabled="getLoading.login"
                      :loading="getLoading.login"
                    >
                      Login
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
            <v-col cols="12" class="py-0">
              <p class="caption">
                New member?
                <router-link
                  class="text-decoration-none ml-1"
                  to="/register/faculty/step=1"
                >
                  Create account
                </router-link>
              </p>
            </v-col>
            <v-col cols="12" class="py-0">
              <p class="caption py-0 my-0">
                Switch to
                <router-link
                  class="text-decoration-none ml-1"
                  to="/register/faculty/step=1"
                >
                  Admin Portal
                </router-link>
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col sm="6" md="8" class="right-container d-none d-sm-flex">
        <v-container fluid class="pa-10"> </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
.main-container {
  .main-container-row {
    width: 100vw;
    height: 100vh;

    .left-container {
      overflow-y: auto;
      max-height: 100vh;
    }
    .right-container {
      background: #1e3163;
      // background-image: url("https://is2-ssl.mzstatic.com/image/thumb/Purple116/v4/61/fc/7e/61fc7e6f-a623-e2b3-24b5-5310f0b340fa/AppIcon-1x_U007emarketing-0-7-0-0-85-220.png/1200x600wa.png");
      background-position: right;
      background-size: contain;
      background-repeat: no-repeat;
      // filter: blur(2.3px);
    }
  }
}

.lnu-logo {
  width: 8rem;
  height: auto;
  margin-top: -10px;
  margin-right: 3px;
}

.app-name {
  font-size: 25px !important;
}
</style>
