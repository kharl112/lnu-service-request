<script>
import { formatDistanceToNow } from "date-fns";
import tableOptions from "./tableOptions";

export default {
  name: "FacultySigned",
  data: () => ({
    table: tableOptions("service_provider.reports.date", "Date Signed"),
  }),
  computed: {
    loading() {
      return this.$store.getters["request/getLoading"];
    },
    signed() {
      return this.$store.getters["request/getSigned"];
    },
  },
  methods: {
    getTimeOrDate(date) {
      return formatDistanceToNow(new Date(date), {
        includeSeconds: true,
        addSuffix: true,
      });
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    goToView(item) {
      this.$router.push(`/faculty/home/view/provider/${item._id}`);
    },
  },
  created() {
    return this.$store.dispatch("request/Signed", "provider");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12">
        <v-container fluid class="pr-0 pb-0 pt-0">
          <v-row justify="space-between" align="start" class="pa-4">
            <v-col cols="12" sm="6">
              <v-subheader class="text-h5"> Signed Requests </v-subheader>
            </v-col>
            <v-col cols="12" sm="6" md="5">
              <v-text-field
                outlined
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
        <v-container fluid v-if="!loading.signed">
          <v-data-table
            @click:row="goToView"
            :headers="table.headers"
            :items="signed"
            :items-per-page="5"
            :search="table.search"
            class="elevation-0 data-table"
          >
            <template v-slot:[`item.user.profile`]="{ item }">
              {{ getFullname(item.user.profile[0].name) }}
            </template>
            <template v-slot:[`item.service_provider.reports.date`]="{ item }">
              <v-chip
                small
                color="primary"
                class="pa-0 pr-2 pl-2 text-center text-caption"
              >
                {{ getTimeOrDate(item.service_provider.reports.date) }}
              </v-chip>
            </template>
            <template v-slot:[`item.reports.status`]="{ item }">
              <span
                :class="`overline font-weight-bold ${
                  item.reports.status === 'completed'
                    ? 'success--text'
                    : 'primary--text'
                }`"
              >
                {{ item.reports.status }}
              </span>
            </template>
          </v-data-table>
        </v-container>
        <v-container fluid v-else-if="loading.signed">
          <v-skeleton-loader type="table" />
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.data-table {
  cursor: pointer;
}
</style>
