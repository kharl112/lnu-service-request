<script>
import { format } from "date-fns";
export default {
  name: "PassSlip",
  props: {
    options: Object,
    rules: Array,
  },
  methods: {
    formatDatePicker(date) {
      return format(date, "yyyy-MM-dd").toString();
    },
    dateValidate() {
      console.log("helloworld");
      this.$store.dispatch("message/errorMessage", "No Selected Date");
    },
  },
};
</script>
<template>
  <v-col cols="12">
    <v-row justify="start" align="start">
      <v-col cols="12" class="py-0 px-0">
        <v-container fluid>
          <v-subheader class="px-0 text-subtitle-1 font-weight-bold"
            >PASS SLIP OPTIONS</v-subheader
          >
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12" class="py-0">
        <v-subheader class="py-0 px-0 font-weight-black text-uppercase">
          Select Date
        </v-subheader>
      </v-col>
      <v-col cols="12" class="pa-4 mb-6">
        <v-row justify="center">
          <v-date-picker
            v-model="options.date"
            class="mt-4"
            :min="formatDatePicker(new Date())"
            elevation="1"
            title="Select date"
          ></v-date-picker>
        </v-row>
        <!-- this is hidden to avoid submitting without date -->
        <v-text-field
          class="d-none"
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
          title="Choose the time you want to out"
          hint="Choose the time you want to out"
          persistent-hint
        />
      </v-col>
    </v-row>
  </v-col>
</template>
