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
      <v-col cols="12">
        <v-container fluid class="py-0">
          <v-subheader class="px-0">Pass Slip Options</v-subheader>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="mx-auto">
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                outlined
                v-model="options.name"
                :rules="rules"
                dense
                label="Name"
              />
              <v-text-field
                outlined
                v-model="options.timeout"
                :rules="rules"
                dense
                type="time"
                label="Select Timeout"
                prepend-inner-icon="mdi-clock-time-four-outline"
              />
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
