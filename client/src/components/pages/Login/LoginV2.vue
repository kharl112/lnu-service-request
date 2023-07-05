<script>
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
    // GoogleLogin,
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
    changeUserType() {
      if (this.user == "faculty") this.user = "admin";
      else this.user = "faculty";

      this.form = { email: "", password: "" };

      this.$refs.form_container.scrollTo({ top: 0, behavior: "smooth" });
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

    const hash = this.$route.hash ? this.$route.hash.replace("#", "") : "";
    this.user = hash ? hash : "faculty";
  },
};
</script>
<template>
  <v-container fluid class="main-container pa-0 ma-0">
    <v-app-bar
      elevation="0"
      outlined
      class="pa-4 d-none d-sm-block"
      color="white"
      style="height: 100%"
    >
      <v-container fluid>
        <v-row justify="space-between" align="center">
          <v-col md="5" sm="4">
            <v-row align="center">
              <img
                src="../../../assets/images/logo-512x512.png"
                class="lnu-logo"
                alt="LNU logo"
                title="Leyte Normal University logo"
              />
              <h1 class="overline primary--text hidden-sm-and-down">
                LNU Service Requesting System
              </h1>
            </v-row>
          </v-col>
          <v-col sm="8" md="7">
            <v-row justify="space-between">
              <router-link
                to="/help/about"
                class="text-decoration-none mt-3 mx-2 black--text"
                title="See about page"
              >
                About
              </router-link>
              <router-link
                to="/help/privacy-and-policy#privacy_notice"
                class="text-decoration-none mt-3 mx-2 black--text"
                title="privacy and policy page"
              >
                Privacy and Policy
              </router-link>
              <router-link
                to="/help/tutorials"
                class="text-decoration-none mt-3 mx-2 black--text"
                title="Explore more tutorials"
              >
                Tutorials
              </router-link>
              <router-link
                to="/help/download-forms"
                class="text-decoration-none mt-3 mx-2 black--text"
                title="Download services forms"
              >
                Downloadable Forms
              </router-link>

              <router-link
                to="/track"
                class="text-decoration-none mt-3 mx-2 black--text"
                title="Download services forms"
              >
                Track Requests
              </router-link>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container fluid class="pa-10 form-container" ref="form_container">
      <v-row justify="start">
        <v-col cols="12" sm="10" md="5">
          <v-col cols="12" sm="10">
            <v-col cols="12" class="my-5 d-block d-sm-none">
              <v-row justify="center">
                <img
                  src="../../../assets/images/logo-512x512.png"
                  class="lnu-logo-mobile"
                  alt="LNUSR logo"
                  title="LNUSR logo"
                />
              </v-row>
            </v-col>
            <p
              class="text-h6 text-sm-h3 text-md-h2 d-none d-sm-block white--text"
            >
              Hi, Welcome Back to
              {{ user == "faculty" ? "Staffs" : "Admin" }} Portal
            </p>
            <v-row justify="center" justify-md="start">
              <v-col cols="12" class="hidden-sm-and-up">
                <v-row justify="center" justify-md="start">
                  <p class="overline font-weight-bold app-name white--text">
                    LNUSR
                  </p>
                </v-row>
                <v-row justify="center" justify-md="start">
                  <p class="overline white--text">
                    LNU Service Requesting System
                  </p>
                </v-row>
              </v-col>
              <v-col cols="12" class="pt-0 d-block d-sm-none">
                <p class="text-center text-capitalize white--text">
                  For {{ user == "faculty" ? "staffs" : "admin" }}
                </p>
              </v-col>
              <v-col cols="12">
                <p
                  class="text-caption text-sm-body text-center text-sm-left white--text"
                >
                  Sign in to continue
                </p>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-form ref="form" @submit="handleSubmit">
              <v-row justify="start">
                <v-col cols="12" sm="10">
                  <v-text-field
                    :disabled="getLoading.login && getLoading.profile"
                    v-model="form.email"
                    label="Email"
                    placeholder="johndoe@example.com"
                    filled
                    prepend-inner-icon="mdi-email"
                    hide-details
                    tabindex="1"
                    autofocus
                    dark
                  />
                </v-col>
                <v-col cols="12" sm="10">
                  <v-text-field
                    :disabled="getLoading.login && getLoading.profile"
                    :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="show ? 'text' : 'password'"
                    v-model="form.password"
                    @click:append="handleShowPassword"
                    label="Password"
                    filled
                    prepend-inner-icon="mdi-lock"
                    tabindex="2"
                    color="white"
                    bg-color="white"
                    class="text-input"
                    hide-details
                    dark
                  />
                </v-col>
                <v-col cols="12" sm="10" class="mt-0 pt-0">
                  <span
                    class="error--text caption font-weight-bold text-capitalize"
                  >
                    {{ getError }}</span
                  >
                </v-col>
                <v-col cols="12" sm="10" class="my-0 pt-0">
                  <router-link
                    to="/forgot/password/step=1"
                    class="text-caption white--text"
                  >
                    I forgot my password
                  </router-link>
                </v-col>
                <v-col cols="12" sm="10" class="pt-0">
                  <v-btn
                    type="submit"
                    block
                    elevation="2"
                    large
                    tabindex="3"
                    :disabled="getLoading.login"
                    :loading="getLoading.login"
                    :color="user == 'faculty' ? 'primary' : 'warning'"
                  >
                    Login
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
          <v-col cols="12" class="py-0 mt-5 white--text">
            <p class="caption">
              New member?
              <router-link
                class="ml-1 white--text"
                :to="`/register/${user}/step=1`"
              >
                Create account
              </router-link>
            </p>
          </v-col>
          <v-col cols="12" class="py-0 white--text">
            <v-chip
              class="caption py-0 my-0 text-capitalize"
              :color="user == 'faculty' ? 'warning' : 'primary'"
            >
              Switch to
              <a
                :href="`#${user}`"
                @click="changeUserType"
                class="ml-1 white--text text-decoration-none"
              >
                <strong>
                  {{ user == "faculty" ? "admin" : "staffs" }} Portal
                </strong>
              </a>
            </v-chip>
          </v-col>
        </v-col>
        <v-col md="7" class="d-none d-md-block">
          <v-container fluid>
            <v-row justify="center">
              <v-col cols="10" class="text-center">
                <img
                  src="../../../assets/images/lnu-logo.png"
                  class="welcome-image"
                />
              </v-col>
              <v-col cols="10" class="py-3 my-6 welcome-text">
                <h3
                  class="text-h4 text-center white--text"
                  v-if="user == 'faculty'"
                >
                  Request Services from <strong> LNU </strong>Chief
                  Administration Office Personnels and Services Providers Online
                </h3>
                <h3 class="text-h4 text-center white--text" v-else>
                  Connect with <strong>LNU </strong>Staffs, Faculty and other
                  <strong>LNU </strong>Personnels
                </h3>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      small
                      v-bind="attrs"
                      v-on="on"
                      @click="install"
                      :color="deferredPrompt ? 'error' : 'grey lighten-1'"
                      medium
                      v-if="deferredPrompt"
                    >
                      Install LNUSR
                      <v-icon v-if="deferredPrompt">mdi-download</v-icon>
                      <v-icon v-else>mdi-download-off</v-icon>
                    </v-btn>
                  </template>
                  <span>
                    {{
                      deferredPrompt
                        ? "Install this app"
                        : "This app is not available for installation"
                    }}
                  </span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12">
          <v-container fluid class="py-10 mt-10">
            <v-row>
              <v-col cols="12" sm="6">
                <span class="white--text caption">
                  <strong>LNUSR 2022. </strong></span
                >
                <span class="white--text caption">
                  This app is built only for LNU staffs and employees</span
                >
              </v-col>
              <v-col cols="12" sm="6" class="text-sm-right">
                <span class="white--text caption text-left text-sm-right">
                  <v-chip>
                    From the I.T and Computer Education Unit of
                    <a
                      href="https://www.lnu.edu.ph/"
                      target="__blank"
                      class="ml-1"
                    >
                      Leyte Normal University
                      <img
                        src="../../../assets/images/lnu-logo.png"
                        class="lnu-logo-small"
                        alt="LNU logo"
                        title="Leyte Normal University logo"
                      />
                    </a>
                  </v-chip>
                </span>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
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
.main-container {
  .main-container-row {
    width: 100vw;
    height: 100vh;
  }

  background-image: url(../../../assets/images/lnu_cme_blur.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.form-container {
  max-height: 90vh;
  overflow-y: auto;
}

.lnu-logo {
  width: 5rem;
  height: auto;
  margin-top: -10px;
  margin-right: 3px;
}
.lnu-logo-mobile {
  width: 10rem;
  height: auto;
}

.lnu-logo-small {
  width: 25px;
  margin-bottom: -8px;
  margin-left: 5px;
}

.app-name {
  font-size: 30px !important;
}

.mt-3 {
  border-bottom: 2px solid transparent;
}

.mt-3:hover {
  border-bottom: 2px solid #1976d2;
}

.welcome-image {
  max-width: 100%;
}
.floating-button {
  position: fixed;
  bottom: 12px;
  right: 12px;
}
.welcome-text {
  text-shadow: 2px 1px 4px black !important;
}
</style>
