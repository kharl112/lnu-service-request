<script>
export default {
  name: "Mailing",
  props: {
    options: Object,
    rules: Array,
  },
  data: () => ({
    postal_services: ["PPC", "JRS"],
  }),
};
</script>
<template>
  <v-col cols="12" sm="12" md="4">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid class="pt-0 pb-0">
          <v-subheader>Mailing Options</v-subheader>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="mx-auto">
          <v-list-item>
            <v-list-item-content>
              <v-card-title>POST</v-card-title>
              <v-col cols="12" class="pb-0">
                <v-text-field
                  class="body-2"
                  dense
                  v-model="options.recipient"
                  outlined
                  :rules="rules"
                  label="Mail to (Name)"
                />
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-select
                  class="body-2"
                  dense
                  v-model="options.postal"
                  :items="postal_services"
                  outlined
                  :rules="rules"
                  label="Postal Services"
                />
              </v-col>
              <v-col
                cols="12"
                class="pt-0 pb-0 mt-n3"
                v-if="options.postal === 'PPC'"
              >
                <v-radio-group :rules="rules" v-model="options.type" column>
                  <v-radio
                    label="Mailing Envelope"
                    color="primary"
                    value="Mailing Envelope"
                  />
                  <v-radio
                    label="Brown Envelope"
                    color="primary"
                    value="Brown Envelope"
                  />
                  <v-radio label="Box" color="primary" value="Box" />
                </v-radio-group>
              </v-col>
              <v-col
                cols="12"
                class="pt-0 pb-0 mt-n3"
                v-if="options.postal === 'JRS'"
              >
                <v-radio-group :rules="rules" v-model="options.type" column>
                  <v-radio
                    label="Registered"
                    color="primary"
                    value="Registered"
                  />
                  <v-radio label="SPEED" color="primary" value="SPEED" />
                  <v-radio label="Priority" color="primary" value="Priority" />
                  <v-radio
                    label="International"
                    color="primary"
                    value="International"
                  />
                </v-radio-group>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  class="body-2"
                  dense
                  v-model="options.released_by"
                  outlined
                  :rules="rules"
                  label="Released By (Name)"
                />
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  class="body-2"
                  dense
                  type="date"
                  v-model="options.released_date"
                  outlined
                  :rules="rules"
                  label="Released By (Name)"
                />
              </v-col>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
