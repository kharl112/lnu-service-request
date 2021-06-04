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
  },
};
</script>
<template>
  <v-card class="pa-5 ma-2" elevation="5" min-width="250" max-width="500px">
    <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <v-card-title class="pa-0 text-left">
            Reset your password
          </v-card-title>
        </v-col>
        <v-col cols="12" class="pt-0 pb-0 ">
          <v-divider />
        </v-col>
        <v-col cols="12" class="pt-2 pb-0 ">
          <v-subheader class="pa-0 text-left">
            Make sure your password is long and unique
          </v-subheader>
          <v-text-field
            v-model="password.new_1"
            :rules="[rules.password[1]]"
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
            type="password"
            outlined
            label="Retype new password"
            dense
          />
        </v-col>
        <v-col cols="12" v-if="false" class="pa-0 pl-3">
          <v-alert class="alert" dense type="error">
            error
          </v-alert>
        </v-col>
        <v-col cols="12" class="pa-0 pl-2 pr-2">
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-card-actions class="pa-0">
            <v-btn color="warning" type="submit" medium elevation="0">
              Submit
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
