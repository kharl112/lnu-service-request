<script>
export default {
  name: "Pass3",
  data: () => {
    return {
      password: { new_1: "", new_2: "" },
      rules: {
        password: [
          (v) => (compare_with) => v === compare_with || "Not matched",
          (v) => v.length > 7 || " Required atleast 8 characters",
        ],
      },
    };
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
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      if (this.$refs.form.validate())
        return this.$store.dispatch(`${this.getUserType}/resetPassword`, {
          new_password: this.password.new_1,
        });
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
            Reset your password
          </v-card-title>
        </v-col>
        <v-col cols="12" class="pt-0 pb-0 ">
          <v-divider v-if="!getLoading.reset_password" />
          <v-progress-linear
            v-else
            class="mt-5"
            indeterminate
            color="primary"
          />
        </v-col>
        <v-col cols="12" class="pt-2 pb-0 ">
          <v-subheader class="pa-0 text-left">
            Make sure your password is long and unique
          </v-subheader>
          <v-text-field
            v-model="password.new_1"
            :rules="[rules.password[1]]"
            :disabled="getLoading.reset_password"
            type="password"
            outlined
            label="New password"
            dense
          />
        </v-col>
        <v-col cols="12" class="pt-0 pb-0 ">
          <v-text-field
            v-model="password.new_2"
            :rules="[rules.password[0](password.new_1), rules.password[1]]"
            :disabled="getLoading.reset_password"
            type="password"
            outlined
            label="Retype new password"
            dense
          />
        </v-col>
        <v-col cols="12" v-if="getError" class="pa-0 pl-3">
          <v-alert class="alert" dense type="error">
            {{ getError }}
          </v-alert>
        </v-col>
        <v-col cols="12" class="pa-0 pl-2 pr-2">
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-card-actions class="pa-0">
            <v-btn
              :disabled="getLoading.reset_password"
              @click="$router.replace(`/${getUserType}/login`)"
              color="grey"
              type="reset"
              medium
              elevation="0"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="getLoading.reset_password"
              color="warning"
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
