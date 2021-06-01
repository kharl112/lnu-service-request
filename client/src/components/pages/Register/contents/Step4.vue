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
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      if (this.$refs.form.validate())
        return this.$store.dispatch("token/claimToken", this.token);
    },
    handleGoBack() {
      return this.$router.replace("/faculty/login");
    },
  },
};
</script>
<template>
  <v-card class="card-container" elevation="5">
    <v-form ref="form" @submit="handleSubmit">
      <v-text-field
        class="input"
        label="Enter Administration Referal Code"
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
