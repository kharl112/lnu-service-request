<script>
export default {
  name: "Step2",
  props: {
    form: Object,
  },
  data() {
    return {
      show: false,
      rules: {
        letters: [
          (v) => !/\d/gi.test(v) || "Only letters allowed in this field",
        ],
        name: [
          (v) => !!v || "This field is required",
          (v) =>
            v.length < 50 ||
            "This field only accepts length less than 50 characters",
        ],
        prefix: [
          (v) =>
            v.length < 10 ||
            "This field only accepts length less than 10 characters",
        ],
        middle_initial: [
          (v) =>
            (v && v.length < 2) ||
            "middle initial must only contain 1 character",
          (v) => !/\d/gi.test(v) || "Only letters allowed in this field",
        ],
        password: [
          (v) =>
            (v && v.length >= 8) ||
            "this field is must be greater than 8 characters",
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
        return this.$router.replace(`/register/step=3`);
    },
  },
};
</script>
<template>
  <v-card class="card-container" outlined>
    <v-form ref="form" @submit="handleNext">
      <v-card-title class="px-0">
        Personal Information
      </v-card-title>
      <v-text-field
        class="input"
        label="Firstname"
        :rules="[...rules.name, ...rules.letters]"
        v-model="form.name.firstname"
        autofocus
        dense
        outlined
      />
      <v-row dense>
        <v-col cols="8" class="py-0">
          <v-text-field
            class="input"
            label="Lastname"
            :rules="[...rules.name, ...rules.letters]"
            v-model="form.name.lastname"
            dense
            outlined
          />
        </v-col>
        <v-col cols="4" class="py-0">
          <v-text-field
            class="input"
            label="Middle Initial"
            :rules="[...rules.middle_initial, ...rules.letters]"
            v-model="form.name.middle_initial"
            dense
            outlined
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="6" class="py-0">
          <v-text-field
            class="input"
            label="Prefix"
            v-model="form.name.prefix"
            :rules="[...rules.letters, ...rules.prefix]"
            dense
            outlined
          />
        </v-col>
        <v-col cols="6" class="py-0">
          <v-text-field
            class="input"
            label="Suffixes"
            v-model="form.name.suffixes"
            hint="comma separated ex: engr, mit"
            dense
            outlined
          />
        </v-col>
      </v-row>
      <v-text-field
        class="input"
        label="Password"
        hint="minimum of 8 characters"
        v-model="form.password"
        :rules="rules.password"
        :type="show ? 'text' : 'password'"
        :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append="handleShowPassword"
        dense
        outlined
      />
      <v-btn type="submit" bottom color="primary" medium elevation="0">
        Next
      </v-btn>
    </v-form>
  </v-card>
</template>
