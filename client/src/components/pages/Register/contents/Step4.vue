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
    getSuccess() {
      return this.$store.getters["message/getSuccess"];
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
    handleResendCode() {
      return this.$store.dispatch("token/resendToken", {
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
    <div class="ma-0 mb-3 caption font-weight-bold">
      We sent you a code to your E-mail
    </div>
    <v-form ref="form" @submit="handleSubmit">
      <v-text-field
        class="input"
        label="Enter Access Code"
        append-icon="mdi-lock-reset"
        suffix="resend code"
        v-model="token"
        :rules="rules.notNull"
        :loading="getLoading"
        :disabled="getLoading"
        @click:append="handleResendCode"
        autofocus
        outlined
        required
      />
      <v-alert class="alert pa-1 pl-2" v-if="getError" type="error">
        {{ getError }}
      </v-alert>
      <v-alert class="alert pa-1 pl-2" v-else-if="getSuccess" type="success">
        {{ getSuccess }}
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
