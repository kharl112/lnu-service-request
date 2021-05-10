<script>
export default {
  name: "Register",
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
        <router-view></router-view>
        <v-row justify="space-between" class="footer-row">
          <router-link
            v-show="getStepIndex !== '1' && getStepIndex !== '4'"
            :to="`/faculty/register/step=${getStepIndex - 1}`"
            >Go back</router-link
          >
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
