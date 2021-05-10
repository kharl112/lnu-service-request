<script>
export default {
  name: "Step2",
  data() {
    return {
      show: false,
    };
  },
  methods: {
    handleShowPassword() {
      return (this.show = !this.show);
    },
  },
};
</script>
<template>
  <v-card class="card-container" elevation="5">
    <v-form>
      <v-text-field
        class="input"
        label="Firstname"
        autofocus
        outlined
        background-color="#E5E5E5"
        required
      />
      <v-row dense>
        <v-col cols="8">
          <v-text-field
            class="input"
            label="Lastname"
            outlined
            background-color="#E5E5E5"
            required
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            class="input"
            label="Middle Initial"
            outlined
            background-color="#E5E5E5"
            required
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
            required
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            class="input"
            label="Suffixes"
            hint="comma separated ex: engr, mit"
            outlined
            background-color="#E5E5E5"
            required
          />
        </v-col>
      </v-row>
      <v-text-field
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        class="input"
        label="Password"
        :type="show ? 'password' : 'text'"
        background-color="#E5E5E5"
        @click:append="handleShowPassword"
        hint="minimum of 8 characters"
        outlined
        required
      />
      <v-btn type="submit" bottom color="warning" medium>
        Next
      </v-btn>
    </v-form>
  </v-card>
</template>
