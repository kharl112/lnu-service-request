<script>
export default {
  name: "Step1",
  props: {
    form: Object,
  },
  data: () => {
    return {
      selections: [
        { value: "faculty", text: "Faculty/Employee/Personnels" },
        { value: "admin", text: "Chief Admin Officer" },
      ],
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
        return this.$store.dispatch(`${this.form.user}/validateEmail`, {
          email: this.form.email,
        });
    },
  },
  computed: {
    getError() {
      return this.$store.getters["message/getError"];
    },
    getLoading() {
      return this.$store.getters[`${this.form.user}/getLoading`];
    },
  },
};
</script>
<template>
  <v-card class="card-container" outlined>
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
        :loading="getLoading.email"
        autofocus
        outlined
        dense
        hint="for example: johndoe123@yahoo.com"
      />
      <v-alert class="alert" v-if="getError" dense type="error">
        {{ getError }}
      </v-alert>
      <v-btn
        :disabled="getLoading.email"
        :loading="getLoading.email"
        type="submit"
        color="primary"
        medium
        elevation="0"
      >
        Next
      </v-btn>
    </v-form>
  </v-card>
</template>
