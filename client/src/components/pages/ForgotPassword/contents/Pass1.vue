<script>
export default {
  name: "Pass1",
  data: () => {
    return {
      email: "",
      user: "faculty",
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
      if (this.$refs.form.validate()) {
        return this.$store.dispatch(`${this.user}/sendEmailLink`, {
          email: this.email,
        });
      }
    },
  },
  computed: {
    getLoading() {
      return this.$store.getters[`${this.user}/getLoading`];
    },
    getError() {
      return this.$store.getters["message/getError"];
    },
  },
};
</script>
<template>
  <v-card class="pa-5 ma-2" outlined min-width="250" max-width="500px">
    <v-form ref="form" @submit="handleSubmit">
      <v-row>
        <v-col cols="12">
          <v-card-title class="pa-0 text-left">
            Find Your Account
          </v-card-title>
        </v-col>
        <v-col cols="12" class="pt-0 pb-0">
          <v-divider v-if="!getLoading.send_email_link" />
          <v-progress-linear
            v-else
            class="mt-5"
            indeterminate
            color="primary"
          />
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-subheader class="pa-0 text-left">
            Please enter your email to search for your account.
          </v-subheader>
          <v-select
            outlined
            :items="selections"
            label="Select user type"
            item-text="text"
            item-value="value"
            v-model="user"
            hide-details
          />
          <v-text-field
            label="Type your E-mail"
            type="email"
            class="mt-2"
            :rules="rules.email"
            v-model="email"
            :disabled="getLoading.send_email_link"
            autofocus
            outlined
            dense
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
        <v-col cols="12" class="pt-0">
          <v-card-actions class="pa-0">
            <v-btn
              color="secondary"
              type="reset"
              text
              outlined
              :disabled="getLoading.send_email_link"
              @click="$router.replace('/login')"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :disabled="getLoading.send_email_link"
              type="submit"
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
