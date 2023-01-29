<script>
export default {
  name: "Risograph",
  props: {
    options: Object,
  },
  data: () => ({
    idle: { title: "", copies: 1, pages: 1, produced: 0 },
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
    newDocument() {
      this.options.documents = [
        ...this.options.documents.map((doc) => ({
          ...doc,
          produced: parseInt(doc.copies) * parseInt(doc.pages),
        })),
        JSON.parse(JSON.stringify(this.idle)),
      ];
    },
    handleProduce() {
      this.options.documents = [
        ...this.options.documents.map((doc) => ({
          ...doc,
          produced: parseInt(doc.copies) * parseInt(doc.pages),
        })),
      ];
      console.log(JSON.parse(JSON.stringify(this.options.documents)));
    },
  },
  mounted() {
    if (this.options.documents.length < 1) this.newDocument();
  },
};
</script>
<template>
  <v-col cols="12">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid class="py-0 px-0">
          <v-subheader class="px-0 text-subtitle-1 font-weight-bold">
            JOB ORDER FOR RISOGRAPH OPTIONS
          </v-subheader>
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
                <v-radio-group
                  v-model="options.with_paper"
                  :rules="[
                    (v) =>
                      v == true || v == false || 'you need to select an option',
                  ]"
                >
                  <span class="mb-2 body-1 secondary--text">With Paper? </span>
                  <v-row justify="start">
                    <v-col cols="12" md="6" class="pt-3 pb-2">
                      <v-radio label="Yes" :value="true" />
                    </v-col>
                    <v-col cols="12" md="6" class="pt-3 pb-2">
                      <v-radio label="No" :value="false" />
                    </v-col>
                  </v-row>
                  <p class="mb-0 mt-7 caption secondary--text">
                    Choose whether if you want to print out copies
                  </p>
                </v-radio-group>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-divider />
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-radio-group
                  v-model="options.back_to_back"
                  :rules="[
                    (v) =>
                      v == true || v == false || 'you need to select an option',
                  ]"
                >
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
                  <p class="mb-0 mt-7 caption secondary--text">
                    Allow to print copies from front to back
                  </p>
                </v-radio-group>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-divider />
              </v-col>
              <v-col cols="12" class="mt-5">
                <v-file-input
                  v-model="options.files"
                  multiple
                  show-size
                  truncate-length="6"
                  color="primary"
                  outlined
                  dense
                  hide-messages
                  placeholder="Upload Documents"
                  :rules="[rules.isRequired]"
                ></v-file-input>
              </v-col>

              <v-col cols="12" class="pa-0">
                <v-divider />
              </v-col>
              <v-col cols="12">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Document Title</th>
                        <th class="text-center">No. of copies</th>
                        <th class="text-center">No. of pages</th>
                        <th class="text-center">Total copies produced</th>
                        <th class="text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(doc, index) in options.documents"
                        :key="index"
                      >
                        <td class="text-center">
                          <v-text-field
                            title="Enter the title of the document"
                            :rules="[rules.isRequired]"
                            dense
                            v-model="doc.title"
                          />
                        </td>
                        <td class="text-center">
                          <v-text-field
                            :rules="[rules.isNumber, rules.isRequiredNumber]"
                            @change="handleProduce()"
                            type="number"
                            dense
                            v-model="doc.copies"
                          />
                        </td>
                        <td class="text-center">
                          <v-text-field
                            :rules="[rules.isNumber, rules.isRequiredNumber]"
                            @change="handleProduce()"
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
                            disabled
                          />
                        </td>
                        <td class="text-center">
                          <v-btn
                            icon
                            color="error"
                            :disabled="options.documents.length === 1"
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
                <v-btn block color="primary" elevation="0" @click="newDocument">
                  Create New
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
