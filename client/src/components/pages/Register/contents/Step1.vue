<script>
export default {
  name: "Step1",
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
      if (this.$refs.form.validate()) return;
    },
  },
};
</script>
<template>
  <v-card class="card-container" elevation="5">
    <v-form ref="form" @submit="handleSubmit">
      <v-text-field
        class="input"
        label="Type your email first"
        type="email"
        :rules="rules.email"
        autofocus
        outlined
        hint="for example: johndoe123@yahoo.com"
        background-color="#E5E5E5"
        required
      />
      <v-btn type="submit" bottom color="warning" medium>
        Next
      </v-btn>
    </v-form>
  </v-card>
</template>
