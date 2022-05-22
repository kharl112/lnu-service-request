<script>
export default {
  name: "CctvReview",
  props: {
    options: Object,
    rules: Array,
  },
  data: () => ({
    payment_options: ["Cash", "Credit"],
  }),
};
</script>
<template>
  <v-col cols="12">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid class="py-0">
          <v-subheader class="px-0">CCTV Review Request Options</v-subheader>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="mx-auto">
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                outlined
                v-model="options.location"
                :rules="rules"
                dense
                label="Location of the Incident"
              />
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="mx-auto">
          <v-list-item>
            <v-list-item-content>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    v-model="options.incident_date"
                    :rules="rules"
                    dense
                    type="date"
                    label="Incident Date"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    outlined
                    v-model="options.incident_time"
                    :rules="rules"
                    dense
                    type="time"
                    label="Incident Time"
                  />
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                outlined
                v-model="options.reviewed_by"
                dense
                label="Reviewed By (Full name)"
              />
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                outlined
                v-model="options.remarks"
                dense
                label="Remarks"
              />
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
