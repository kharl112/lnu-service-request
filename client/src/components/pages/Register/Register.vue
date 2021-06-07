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
          unit_name: "",
          unit_role: 1,
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
        <router-link to="/" class="text-decoration-none">
          <h3
            id="heading"
            :class="
              `text-h5 text-sm-h4 text-md-h4 ${
                $vuetify.theme.dark ? 'primary--text' : ''
              }`
            "
          >
            <em>LNU</em>
            Service Request System
          </h3>
        </router-link>
        <transition name="slide-right" mode="out-in">
          <router-view :form="form"></router-view>
        </transition>
        <v-row justify="space-between" class="footer-row">
          <router-link
            class="subtitle-2"
            v-show="getStepIndex !== '1' && getStepIndex !== '4'"
            :to="`/faculty/register/step=${getStepIndex - 1}`"
          >
            Go back
          </router-link>
          <router-link
            class="subtitle-2"
            v-show="getStepIndex === '1'"
            to="/faculty/login/"
          >
            I have an account
          </router-link>
          <v-tooltip bottom v-if="getStepIndex === '4'">
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" class="tooltip-text">
                What is this?
              </span>
            </template>
            <span>
              Wait for the Administration department to send a code to your
              email
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
