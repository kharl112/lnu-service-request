<script>
export default {
  name: "Step1",
  props: {
    form: Object,
  },
  data: () => {
    return {
      rules: {
        email: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ],
      },
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      if (this.$refs.form.validate())
        return this.$store.dispatch(`${this.getUserType}/validateEmail`, {
          email: this.form.email,
        });
    },
  },
  computed: {
    getUserType() {
      return this.$route.params.user_type;
    },
    getError() {
      return this.$store.getters["message/getError"];
    },
    getLoading() {
      return this.$store.getters[`${this.getUserType}/getLoading`];
    },
  },
};
</script>
<template>
  <v-card class="card-container" elevation="5">
    <v-form ref="form" @submit="handleSubmit">
      <v-subheader class="pa-0 ma-0 mb-3 mb-sm-0 caption font-weight-bold">
        NOTE: Please use your active email to validate your account
      </v-subheader>
      <v-text-field
        class="input"
        label="Type your email first"
        type="email"
        :rules="rules.email"
        v-model="form.email"
        :disabled="getLoading.email"
        autofocus
        outlined
        hint="for example: johndoe123@yahoo.com"
      />
      <v-alert class="alert" v-if="getError" dense type="error">
        {{ getError }}
      </v-alert>
      <v-btn
        :disabled="getLoading.email"
        type="submit"
        bottom
        color="warning"
        medium
      >
        Next
      </v-btn>
    </v-form>
  </v-card>
</template>
