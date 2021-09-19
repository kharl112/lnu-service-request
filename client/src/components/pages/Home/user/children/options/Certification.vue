<script>
export default {
  name: "Certification",
  props: {
    options: Object,
  },
};
</script>
<template>
  <v-col cols="12" sm="12" md="4">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid class="pt-0 pb-0">
          <v-subheader class="text-uppercase">
            Request for Records/Certification
          </v-subheader>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12">
        <v-row justify="start" align="start">
          <v-col cols="12">
            <v-subheader class="h5">
              Request for:
           </v-subheader>
          </v-col>
        </v-row>
     </v-col>
    </v-row>
  </v-col>
</template>
