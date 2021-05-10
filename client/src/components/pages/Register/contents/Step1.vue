<script>
export default {
  name: "Step1",
};
</script>
<template>
  <v-card class="card-container" elevation="5">
    <v-form>
      <v-text-field
        class="input"
        label="Type your email first"
        type="email"
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
