<script>
export default {
  name: "Step4",
};
</script>
<template>
  <v-card class="card-container" elevation="5">
    <v-form>
      <v-text-field
        class="input"
        label="Enter Administration Referal Code"
        placeholder="XXX-XXX-XXX"
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
          <v-btn type="reset" bottom color="gray" medium>
            Skip
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
