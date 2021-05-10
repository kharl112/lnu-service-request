<script>
export default {
  name: "Step2",
  data() {
    return {
      show: false,
      rules: {
        name: [(v) => !!v || "This field is required"],
        middle_name: [
          (v) =>
            (v && v.length < 2) ||
            "middle initial must only contain 1 character",
        ],
        password: [
          (v) =>
            (v && v.length <= 8) ||
            "this field is must be less than 8 characters",
        ],
      },
    };
  },
  methods: {
    handleShowPassword() {
      return (this.show = !this.show);
    },
    handleNext(e) {
      e.preventDefault();
      if (this.$refs.form.validate())
        return this.$router.replace("/faculty/register/step=3");
    },
  },
};
</script>
<template>
  <v-card class="card-container" elevation="5">
    <v-form ref="form" @submit="handleNext">
      <v-text-field
        class="input"
        label="Firstname"
        :rules="rules.name"
        autofocus
        outlined
        background-color="#E5E5E5"
      />
      <v-row dense>
        <v-col cols="8">
          <v-text-field
            class="input"
            label="Lastname"
            :rules="rules.name"
            outlined
            background-color="#E5E5E5"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            class="input"
            label="Middle Initial"
            :rules="rules.middle_name"
            outlined
            background-color="#E5E5E5"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="6">
          <v-text-field
            class="input"
            label="Prefix"
            outlined
            background-color="#E5E5E5"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            class="input"
            label="Suffixes"
            hint="comma separated ex: engr, mit"
            outlined
            background-color="#E5E5E5"
          />
        </v-col>
      </v-row>
      <v-text-field
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        class="input"
        :rules="rules.password"
        label="Password"
        :type="show ? 'password' : 'text'"
        background-color="#E5E5E5"
        @click:append="handleShowPassword"
        hint="minimum of 8 characters"
        outlined
      />
      <v-btn type="submit" bottom color="warning" medium>
        Next
      </v-btn>
    </v-form>
  </v-card>
</template>
