<script>
export default {
  name: "Unavailable",
};
</script>
<template>
  <v-col cols="12" sm="12" md="4" class="hidden-sm-and-down">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid class="pt-0 pb-0">
          <v-subheader class="error--text">
            <v-icon color="error" class="mr-2">mdi-information</v-icon>
            No options available for this type of service
          </v-subheader>
          <v-divider />
        </v-container>
      </v-col>
    </v-row>
  </v-col>
</template>
