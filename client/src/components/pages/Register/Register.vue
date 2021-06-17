<script>
export default {
  name: "Register",
  data: () => {
    return {
      form: {
        staff_id: "",
        email: "",
        password: "",
        name: {
          firstname: "",
          lastname: "",
          middle_initial: "",
          prefix: "",
          suffixes: "",
        },
        department: {
          unit_id: "",
          role_id: "",
        },
      },
    };
  },
  computed: {
    getUserType() {
      return this.$route.params.user_type;
    },
    getStepIndex() {
      return this.$route.path[this.$route.path.length - 1];
    },
    getDarkmode() {
      return this.$vuetify.theme.dark;
    },
  },
};
</script>
<template>
  <v-container fluid class="register-main-container">
    <v-row
      no-gutters
      dense
      justify="center"
      align="center"
      class="register-row1"
    >
      <v-col sm="9" md="4">
        <v-row justify="center" align="center">
          <v-col md="4" class="hidden-sm-and-down" align="center">
            <v-img
              max-width="100"
              min-width="70"
              src="../../../assets/images/logo-512x512.png"
            />
          </v-col>
          <v-col cols="12" md="8" class="pb-2">
            <router-link to="/" class="text-decoration-none">
              <h3
                id="heading"
                class="text-h5 text-sm-h4 text-md-h5 text-center text-md-left primary--text"
              >
                <em>LNU</em>
                Service Request System
              </h3>
            </router-link>
            <h5
              class="caption pa-0 pt-2 font-weight-bold text-center text-md-left primary--text"
            >
              {{
                getUserType === "faculty"
                  ? "Faculty & Personnel Registration"
                  : "Chief Admin Office Registration"
              }}
            </h5>
          </v-col>
        </v-row>

        <transition name="slide-right" mode="out-in">
          <router-view :form="form"></router-view>
        </transition>
        <v-row justify="space-between" class="footer-row">
          <router-link
            class="subtitle-2"
            v-show="getStepIndex !== '1' && getStepIndex !== '4'"
            :to="`/${this.getUserType}/register/step=${getStepIndex - 1}`"
          >
            Go back
          </router-link>
          <router-link
            class="subtitle-2 primary--text"
            v-show="getStepIndex === '1'"
            :to="`/${getUserType}/login`"
          >
            I have an account
          </router-link>
          <v-tooltip bottom v-if="getStepIndex === '4'">
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" class="tooltip-text primary--text">
                What is this?
              </span>
            </template>
            <span>
              Check your E-mail account to proceed
            </span>
          </v-tooltip>
          <small>
            <strong> Step {{ getStepIndex }} of 4</strong> of creating an
            account.
          </small>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
@import "../../../assets/scss/pages/Register/register.scss";
</style>
