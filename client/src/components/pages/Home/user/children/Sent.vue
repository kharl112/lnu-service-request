<script>
import { formatDistanceToNow } from "date-fns";
import tableOptions from "./tableOptions";
export default {
  name: "Sent",
  data: () => ({
    table: tableOptions,
    filter: [
      { text: "All", value: "all" },
      { text: "Pending", value: "pending" },
      { text: "Completed", value: "completed" },
    ],
  }),
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getAllSend() {
      return this.$store.getters["request/getAllSend"];
    },
  },
  methods: {
    getTimeOrDate(date) {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        includeSeconds: true,
      }).replace("about ", "");
    },
    gotoCreate() {
      return this.$router.push(`/faculty/home/compose`);
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    handleFilter(filter) {
      return this.$store.dispatch("request/allSend", {
        filter,
        type: "faculty",
      });
    },
  },
  created() {
    this.$store.dispatch("request/allSend", { filter: "all", type: "faculty" });
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12" class="pa-0">
        <v-container fluid>
          <v-row justify="space-between" align="start" class="pa-2">
            <v-col cols="12" sm="6" md="4">
              <v-select
                outlined
                class="mb-n5"
                label="Filter"
                value="all"
                @change="handleFilter"
                prepend-inner-icon="mdi-filter"
                :items="filter"
                item-text="text"
                item-value="value"
                dense
              />
            </v-col>
            <v-col cols="12" sm="6" md="6" v-if="getAllSend[0]">
              <v-text-field
                v-model="table.search"
                append-icon="mdi-magnify"
                label="Search"
                dense
                single-line
                hide-details
              />
            </v-col>
          </v-row>
          <v-divider />
        </v-container>
        <v-container fluid v-if="getAllSend[0] && !getLoading.all_send">
          <v-data-table
            @click:row="
              (item) => $router.push(`/faculty/home/view/user/${item._id}`)
            "
            :headers="table.headers"
            :items="getAllSend"
            :search="table.search"
            :items-per-page="5"
            class="elevation-0"
          >
            <template v-slot:item.date="{ item }">
              <v-chip
                small
                color="primary"
                class="pa-0 pr-2 pl-2 text-center text-caption"
              >
                {{ getTimeOrDate(item.date) }}
              </v-chip>
            </template>
            <template v-slot:item.status="{ item }">
              <small
                :class="
                  `${item.status === 0 ? 'primary--text' : 'success--text'}`
                "
              >
                {{ item.status === 0 ? "Pending" : "Completed" }}
              </small>
            </template>
          </v-data-table>
        </v-container>
        <v-container fluid v-else-if="getLoading.all_send">
          <v-skeleton-loader type="table" />
        </v-container>
        <v-container fluid v-else-if="!getAllSend[0] && !getLoading.all_send">
          <v-row justify="start">
            <v-col cols="12">
              <v-banner single-line>
                <v-icon slot="icon" color="warning" size="36">
                  mdi-exclamation-thick
                </v-icon>
                No service requests found
                <template v-slot:actions>
                  <v-btn color="primary" @click="gotoCreate" text>
                    create
                  </v-btn>
                </template>
              </v-banner>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss">
.expansion-panel {
  padding: 0;
}
#main-container {
  padding: 0px;
  margin: 0px;
  padding-left: 45px;
}
@media (max-width: 600px) {
  #main-container {
    padding-left: 25px;
  }
}
</style>
