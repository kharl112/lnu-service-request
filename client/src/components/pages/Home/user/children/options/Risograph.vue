<script>
export default {
  name: "Risograph",
  props: {
    options: Object,
  },
  data: () => ({
    idle: { title: "", copies: 0, pages: 0, produced: 0 },
    rules: {
      isNumber: (v) =>
        (/\d/gi.test(v) && parseInt(v) >= 0) || "a valid number is required",
      isRequiredNumber: (v) => parseInt(v) > 0 || "this number is required",
      isRequired: (v) => !!v || "this field is required",
    },
  }),
  methods: {
    deleteIndex(index) {
      this.options.documents = this.options.documents.filter(
        (node, count) => count !== index
      );
    },
    reset() {
      return ([
        this.options.with_paper,
        this.options.back_to_back,
        this.options.documents,
      ] = [false, false, []]);
    },
    saveIdle() {
      const { documents } = this.options;
      this.options.documents = [
        ...documents,
        JSON.parse(JSON.stringify(this.idle)),
      ];
      this.idle = { title: "", copies: 0, pages: 0, produced: 0 };
    },
  },
};
</script>
<template>
  <v-col cols="12" sm="12" md="4">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid class="pt-0 pb-0">
          <v-subheader>Job Order for Risograph Options</v-subheader>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="mx-auto">
          <v-container fluid class="pa-4">
            <v-row justify="start">
              <v-col cols="12" class="pb-0">
                <p class="mt-2 mb-0 pb-0 body-2 secondary--text">
                  Please produce the following request for risograph
                </p>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-radio-group v-model="options.with_paper">
                  <span class="mb-2 body-1 secondary--text">With Paper? </span>
                  <v-row justify="start">
                    <v-col cols="12" md="6" class="pt-3 pb-2">
                      <v-radio label="Yes" :value="true" />
                    </v-col>
                    <v-col cols="12" md="6" class="pt-3 pb-2">
                      <v-radio label="No" :value="false" />
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-divider />
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-radio-group v-model="options.back_to_back">
                  <span class="mb-2 body-1 secondary--text"
                    >Back to back?
                  </span>
                  <v-row justify="start">
                    <v-col cols="12" md="6" class="pt-3 pb-2">
                      <v-radio label="Yes" :value="true" />
                    </v-col>
                    <v-col cols="12" md="6" class="pt-3 pb-2">
                      <v-radio label="No" :value="false" />
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-divider />
              </v-col>
              <v-col cols="12">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Document Title
                        </th>
                        <th class="text-center">
                          No. of copies
                        </th>
                        <th class="text-center">
                          No. of pages
                        </th>
                        <th class="text-center">
                          Total copies produced
                        </th>
                        <th class="text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(doc, index) in options.documents"
                        :key="index"
                      >
                        <td class="text-center">
                          <v-text-field
                            :rules="[rules.isRequired]"
                            dense
                            v-model="doc.title"
                          />
                        </td>
                        <td class="text-center">
                          <v-text-field
                            :rules="[rules.isNumber, rules.isRequiredNumber]"
                            type="number"
                            dense
                            v-model="doc.copies"
                          />
                        </td>
                        <td class="text-center">
                          <v-text-field
                            :rules="[rules.isNumber, rules.isRequiredNumber]"
                            type="number"
                            dense
                            v-model="doc.pages"
                          />
                        </td>
                        <td class="text-center">
                          <v-text-field
                            :rules="[rules.isNumber]"
                            type="number"
                            dense
                            v-model="doc.produced"
                          />
                        </td>
                        <td class="text-center">
                          <v-btn icon color="error" @click="deleteIndex(index)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <v-text-field v-model="idle.title" dense />
                        </td>
                        <td class="text-center">
                          <v-text-field
                            class="body-2"
                            v-model="idle.copies"
                            type="number"
                            dense
                          />
                        </td>
                        <td class="text-center">
                          <v-text-field
                            class="body-2"
                            v-model="idle.pages"
                            type="number"
                            dense
                          />
                        </td>
                        <td class="text-center">
                          <v-text-field
                            class="body-2"
                            v-model="idle.produced"
                            type="number"
                            dense
                          />
                        </td>
                        <td class="text-center">
                          <v-btn
                            type="submit"
                            icon
                            color="primary"
                            @click="saveIdle"
                          >
                            <v-icon>mdi-content-save</v-icon>
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
                <v-btn block color="primary" elevation="0" @click="reset">
                  RESET
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
