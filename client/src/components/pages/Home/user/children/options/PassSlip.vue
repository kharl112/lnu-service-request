<script>
export default {
  name: "PassSlip",
  props: {
    options: Object,
    rules: Array,
  },
};
</script>
<template>
  <v-col cols="12">
    <v-row justify="start" align="start">
      <v-col cols="12" class="py-0 px-0">
        <v-container fluid>
          <v-subheader class="px-0">PASS SLIP OPTIONS</v-subheader>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12" class="py-0">
        <v-subheader class="py-0 px-0 font-weight-black text-uppercase">
          Date
        </v-subheader>
      </v-col>
      <v-col cols="12">
        <v-text-field
          outlined
          v-model="options.date"
          :rules="rules"
          dense
          type="date"
          label="Select Date"
          prepend-inner-icon="mdi-calendar"
        />
      </v-col>
      <v-col cols="12" class="py-0">
        <v-subheader class="py-0 px-0 font-weight-black text-uppercase">
          Timeout
        </v-subheader>
      </v-col>
      <v-col cols="12">
        <v-text-field
          outlined
          v-model="options.timeout"
          :rules="rules"
          dense
          type="time"
          label="Select Timeout"
          prepend-inner-icon="mdi-clock-time-four-outline"
        />
      </v-col>
    </v-row>
  </v-col>
</template>
