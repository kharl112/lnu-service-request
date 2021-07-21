<script>
export default {
  name: "Risograph",
  props: {
    options: Object,
    rules: Array,
  },
  data: () => ({ idle: { title: "", copies: 0, pages: 0, produced: 0 } }),
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
      return (this.options.documents = [
        ...documents,
        JSON.parse(JSON.stringify(this.idle)),
      ]);
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
          <v-list-item>
            <v-list-item-content>
              <p class="mt-2 mb-0 pb-0 body-2 secondary--text">
                Please produce the following request for risograph
              </p>
              <v-radio-group v-model="options.with_paper">
                <span class="mb-2 body-1 secondary--text">With Paper? </span>
                <v-row justify="start">
                  <v-col cols="6" class="pt-3 pr-2 pb-1">
                    <v-radio label="Yes" :value="true" />
                  </v-col>
                  <v-col cols="6" class="pt-3 pr-2 pb-1">
                    <v-radio label="No" :value="false" />
                  </v-col>
                </v-row>
              </v-radio-group>
              <v-divider />
              <v-radio-group v-model="options.back_to_back">
                <span class="mb-2 body-1 secondary--text">Back to back? </span>
                <v-row justify="start">
                  <v-col cols="6" class="pt-3 pr-2 pb-1">
                    <v-radio label="Yes" :value="true" />
                  </v-col>
                  <v-col cols="6" class="pt-3 pr-2 pb-1">
                    <v-radio label="No" :value="false" />
                  </v-col>
                </v-row>
              </v-radio-group>
              <v-divider class="mb-5" />
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
                    <tr v-for="(doc, index) in options.documents" :key="index">
                      <td>{{ doc.title }}</td>
                      <td class="text-center">{{ doc.copies }}</td>
                      <td class="text-center">{{ doc.pages }}</td>
                      <td class="text-center">{{ doc.produced }}</td>
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
                        <v-btn icon color="primary" @click="saveIdle">
                          <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-divider class="mb-5" />
              <v-btn block color="primary" elevation="0" @click="reset">
                RESET
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
