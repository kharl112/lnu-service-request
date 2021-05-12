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
        <h3 id="heading" class=" text-h5 text-sm-h5 text-md-h4">
          <em>LNU</em>
          Service Request System
        </h3>
        <transition name="slide-right" mode="out-in">
          <router-view :form="form"></router-view>
        </transition>
        <v-row justify="space-between" class="footer-row">
          <router-link
            v-show="getStepIndex !== '1' && getStepIndex !== '4'"
            :to="`/faculty/register/step=${getStepIndex - 1}`"
            >Go back</router-link
          >
          <router-link v-show="getStepIndex === '1'" to="/faculty/login/"
            >I have an account</router-link
          >
          <v-tooltip bottom v-if="getStepIndex === '4'">
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" class="tooltip-text"
                >What is this?</span
              >
            </template>
            <span>Please approach the admin department and ask for code</span>
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
