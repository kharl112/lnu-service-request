<script>
export default {
  name: "Step4",
  data: () => {
    return {
      rules: {
        notNull: [(v) => !!v || "This field is not allowed to be empty"],
      },
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      if (this.$refs.form.validate()) return;
    },
    handleGoBack() {
      return this.$router.back();
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
        :rules="rules.notNull"
        autofocus
        outlined
        background-color="#E5E5E5"
        required
      />
      <v-row dense>
        <v-col cols="4">
          <v-btn type="submit" bottom color="warning" medium>
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
