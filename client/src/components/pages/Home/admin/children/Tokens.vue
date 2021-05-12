<script>
export default {
  name: "Tokens",
  data: () => ({
    items: [
      { text: "All", value: "all" },
      { text: "Claimed", value: "claimed" },
      { text: "Unclaimed", value: "unclaimed" },
    ],
  }),
  computed: {
    getTokens() {
      return this.$store.getters["token/getTokens"];
    },
    getLoading() {
      return this.$store.getters["token/getLoading"];
    },
    getError() {
      return this.$store.getters["token/getError"];
    },
  },
  methods: {
    filterTokens(filter) {
      return this.$store.dispatch(`token/showTokens`, filter);
    },
  },
  created() {
    return this.filterTokens("all");
  },
};
</script>
<template>
  <v-container fluid id="#tokens-container">
    <v-row
      justify="start"
      justify-sm="start"
      justify-md="center"
      align-md="start"
      dense
      no-gutters
    >
      <v-col cols="12" sm="12" md="11" align-self="end">
        <v-row justify-md="end" align-md="start">
          <v-col cols="12" sm="12" md="3">
            <v-select
              @change="(event) => filterTokens(event)"
              :items="items"
              item-value="value"
              item-text="text"
              label="Filter"
              outlined
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12" md="11">
        <v-simple-table
          fixed-header
          height="400px"
          width="100%"
          v-if="!getLoading"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left hidden-sm-and-down">
                  ID
                </th>
                <th class="text-left hidden-sm-and-down">
                  Claimer
                </th>
                <th class="text-left">
                  Claimed
                </th>
                <th class="text-left">
                  Token
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="token in getTokens" :key="token._id">
                <td class="hidden-sm-and-down">
                  {{
                    token._id
                      .split("")
                      .slice(2, 8)
                      .join("")
                  }}
                </td>
                <td class="hidden-sm-and-down">
                  {{
                    token.claimerID
                      .split("")
                      .slice(2, 8)
                      .join("") || "--"
                  }}
                </td>
                <td>{{ JSON.stringify(token.claimed) }}</td>
                <td>{{ token.token }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-skeleton-loader
          v-else
          class="mx-auto"
          max-width="100%"
          type="table"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
