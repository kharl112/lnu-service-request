<script>
export default {
  name: "IssueSlip",
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
          <v-subheader class="px-0">Issue Slip Options</v-subheader>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="mx-auto">
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                outlined
                v-model="options.liters"
                :rules="rules"
                type="number"
                dense
                label="Gas in liters"
              />
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    v-model="options.amount"
                    :rules="rules"
                    dense
                    type="number"
                    label="Price PHP"
                  />
                </v-col>
                <v-col>
                  <v-select
                    class="body-2"
                    outlined
                    dense
                    v-model="options.type"
                    :items="payment_options"
                    :rules="rules"
                    label="Payment Type"
                  />
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                outlined
                v-model="options.issue_to"
                :rules="rules"
                dense
                label="Issue to (Full name)"
              />
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
