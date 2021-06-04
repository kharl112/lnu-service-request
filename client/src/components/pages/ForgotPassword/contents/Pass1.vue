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
  computed: {
    getUserType() {
      return this.$route.params.user_type;
    },
  },
};
</script>
<template>
  <v-card class="pa-5 ma-2" elevation="5" min-width="250" max-width="500px">
    <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <v-card-title class="pa-0 text-left">
            Find Your Account
          </v-card-title>
        </v-col>
        <v-col cols="12" class="pt-0 pb-0 ">
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-subheader class="pa-0 text-left">
            Please enter your email to search for your account.
          </v-subheader>
          <v-text-field
            label="Type your E-mail"
            type="email"
            :rules="rules.email"
            v-model="email"
            autofocus
            outlined
            hint="Example: johndoe123@yahoo.com"
          />
        </v-col>
        <v-col cols="12" v-if="false" class="pa-0 pl-3">
          <v-alert class="alert" dense type="error">
            error
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
              @click="$router.back()"
            >
              Cancel
            </v-btn>
            <v-btn color="warning" type="submit" medium elevation="0">
              Submit
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
