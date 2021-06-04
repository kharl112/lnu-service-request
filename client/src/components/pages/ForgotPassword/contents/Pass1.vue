<script>
export default {
  name: "Pass1",
  data: () => {
    return {
      email: "",
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
      if (this.$refs.form.validate()) {
        return this.$store.dispatch(`${this.getUserType}/sendEmailLink`, {
          email: this.email,
        });
      }
    },
  },
  computed: {
    getUserType() {
      return this.$route.params.user_type;
    },
    getLoading() {
      return this.$store.getters[`${this.getUserType}/getLoading`];
    },
    getError() {
      return this.$store.getters["message/getError"];
    },
  },
};
</script>
<template>
  <v-card class="pa-5 ma-2" elevation="5" min-width="250" max-width="500px">
    <v-form ref="form" @submit="handleSubmit">
      <v-row>
        <v-col cols="12">
          <v-card-title class="pa-0 text-left">
            Find Your Account
          </v-card-title>
        </v-col>
        <v-col cols="12" class="pt-0 pb-0 ">
          <v-divider v-if="!getLoading.send_email_link" />
          <v-progress-linear
            v-else
            class="mt-5"
            indeterminate
            color="primary"
          />
        </v-col>
        <v-col cols="12">
          <v-subheader class="pa-0 text-left">
            Please enter your email to search for your account.
          </v-subheader>
          <v-text-field
            label="Type your E-mail"
            type="email"
            class="mt-2"
            :rules="rules.email"
            v-model="email"
            :disabled="getLoading.send_email_link"
            autofocus
            outlined
            hint="Example: johndoe123@yahoo.com"
          />
        </v-col>
        <v-col cols="12" v-if="getError" class="pa-0 pr-4 pl-4">
          <v-alert class="text-left alert pa-2" dense type="error">
            {{ getError }}
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-card-actions class="pa-0">
            <v-btn
              color="grey"
              medium
              type="reset"
              elevation="0"
              :disabled="getLoading.send_email_link"
              @click="$router.back()"
            >
              Cancel
            </v-btn>
            <v-btn
              color="warning"
              :disabled="getLoading.send_email_link"
              type="submit"
              medium
              elevation="0"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
