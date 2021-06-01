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
        name: [(v) => !!v || "This field is required"],
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
        :rules="[...rules.name, ...rules.letters]"
        v-model="form.name.firstname"
        autofocus
        outlined
      />
      <v-row dense>
        <v-col cols="8">
          <v-text-field
            class="input"
            label="Lastname"
            :rules="[...rules.name, ...rules.letters]"
            v-model="form.name.lastname"
            outlined
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            class="input"
            label="Middle Initial"
            :rules="[...rules.middle_initial, ...rules.letters]"
            v-model="form.name.middle_initial"
            outlined
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="6">
          <v-text-field
            class="input"
            label="Prefix"
            v-model="form.name.prefix"
            :rules="rules.letters"
            outlined
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            class="input"
            label="Suffixes"
            :rules="rules.letters"
            v-model="form.name.suffixes"
            hint="comma separated ex: engr, mit"
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
        outlined
      />
      <v-btn type="submit" bottom color="warning" medium>
        Next
      </v-btn>
    </v-form>
  </v-card>
</template>
