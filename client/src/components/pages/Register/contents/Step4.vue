<script>
export default {
  name: "Step4",
  data: () => {
    return {
      token: "",
      rules: {
        notNull: [(v) => !!v || "This field is not allowed to be empty"],
      },
    };
  },
  computed: {
    getError() {
      return this.$store.getters["message/getError"];
    },
    getLoading() {
      return this.$store.getters["token/getLoading"];
    },
    getUserType() {
      return this.$route.params.user_type;
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      if (this.$refs.form.validate())
        return this.$store.dispatch("token/claimToken", {
          token: this.token,
          userType: this.getUserType,
        });
    },
    handleGoBack() {
      localStorage.removeItem("Authorization");
      return this.$router.replace(`/${this.getUserType}/login`);
    },
  },
};
</script>
<template>
  <v-card class="card-container" elevation="5">
    <div class="ma-0 mb-3 caption">
      The
      <span class="font-weight-bold"> MIS Team </span>
      will send you a code in your 
      <span class="font-weight-bold"> E-MAIL </span> 
      after they recieved your account info.
    </div>
    <v-form ref="form" @submit="handleSubmit">
      <v-text-field
        class="input"
        label="Enter Access Code"
        v-model="token"
        :rules="rules.notNull"
        :disabled="getLoading"
        autofocus
        outlined
        required
      />
      <v-alert class="alert" v-if="getError" dense type="error">
        {{ getError }}
      </v-alert>
      <v-row dense>
        <v-col cols="4">
          <v-btn
            type="submit"
            :disabled="getLoading"
            bottom
            color="warning"
            medium
          >
            Submit
          </v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn type="reset" @click="handleGoBack" bottom color="gray" medium>
            Not Now
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
