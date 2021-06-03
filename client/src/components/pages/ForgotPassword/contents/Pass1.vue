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
};
</script>
<template>
  <v-card class="pa-5 ma-2" outlined min-width="250" max-width="500px">
    <v-form ref="form">
      <v-row>
        <v-col cols="12">
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
        <v-col cols="7" sm="5" md="3" class="pa-0 pl-3">
          <v-btn type="submit" block bottom color="warning" medium>
            Next
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
