<script>
export default {
  name: "PassSlip",
  props: {
    options: Object,
    rules: Array,
  },
  data: () => ({
    modal2: false,
  }),
};
</script>
<template>
  <v-col cols="12" sm="12" md="4">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid class="pt-0 pb-0">
          <v-subheader>Pass Slip Options</v-subheader>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="mx-auto">
          <v-list-item>
            <v-list-item-content>
              <v-card-title>Timeout</v-card-title>
              <v-dialog
                ref="dialog"
                v-model="modal2"
                :return-value.sync="options.timeout"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    v-model="options.timeout"
                    :rules="rules"
                    dense
                    label="Select Timeout"
                    prepend-inner-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-if="modal2"
                  v-model="options.timeout"
                  full-width
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal2 = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(options.timeout)"
                  >
                    OK
                  </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
