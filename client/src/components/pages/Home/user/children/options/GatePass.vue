<script>
export default {
  name: "GatePass",
  props: {
    options: Object,
  },
  data: () => ({
    idle: { name: "", contact_number: "" },
    rules: {
      isNumber: (v) =>
        (/\d/gi.test(v) && parseInt(v) >= 0) || "a valid number is required",
      isRequiredNumber: (v) => parseInt(v) > 0 || "this number is required",
      isRequired: (v) => !!v || "this field is required",
    },
  }),
  methods: {
    deleteIndex(index) {
      this.options.passers = this.options.passers.filter(
        (node, count) => count !== index
      );
    },
    newPasser() {
      this.options.passers = [
        ...this.options.passers,
        JSON.parse(JSON.stringify(this.idle)),
      ];
    },
  },
  mounted() {
    if (this.options.passers.length < 1) this.newPasser();
  },
};
</script>
<template>
  <v-col cols="12">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid class="py-0">
          <v-subheader class="px-0">Gate Pass Request Options</v-subheader>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="mx-auto">
          <v-container fluid class="pa-4">
            <v-row justify="start">
              <v-col cols="12" class="pt-0 pb-0">
                <v-list-item>
                  <v-list-item-content>
                    <v-row>
                      <v-col>
                        <v-text-field
                          outlined
                          v-model="options.duration"
                          :rules="[rules.isRequired]"
                          dense
                          label="Duration"
                          hint="(sec/min/hr)"
                        />
                      </v-col>
                      <v-col>
                        <v-text-field
                          outlined
                          v-model="options.use_date"
                          :rules="[rules.isRequired]"
                          dense
                          type="date"
                          label="Date of use"
                        />
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-divider />
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-list-item>
                  <v-list-item-content>
                    <v-text-field
                      outlined
                      v-model="options.location"
                      :rules="[rules.isRequired]"
                      dense
                      label="Location"
                    />
                    <v-text-field
                      outlined
                      v-model="options.security_name"
                      :rules="[rules.isRequired]"
                      dense
                      label="Name of the Chief Security"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-divider />
              </v-col>
              <v-col cols="12" style="text-align: center; font-weight: bold">
                Passers info
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-divider />
              </v-col>
              <v-col cols="12">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Name</th>
                        <th class="text-center">Contact Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(passer, index) in options.passers"
                        :key="index"
                      >
                        <td class="text-center">
                          <v-text-field
                            :rules="[rules.isRequired]"
                            dense
                            v-model="passer.name"
                          />
                        </td>
                        <td class="text-center">
                          <v-text-field
                            :rules="[rules.isNumber, rules.isRequiredNumber]"
                            dense
                            v-model="passer.contact_number"
                          />
                        </td>
                        <td class="text-center">
                          <v-btn
                            icon
                            color="error"
                            :disabled="options.passers.length === 1"
                            @click="deleteIndex(index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-divider />
              </v-col>
              <v-col cols="12">
                <v-btn block color="primary" elevation="0" @click="newPasser">
                  Add new
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
