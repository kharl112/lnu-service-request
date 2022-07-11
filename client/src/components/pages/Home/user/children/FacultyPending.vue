<script>
import { formatDistanceToNow } from "date-fns";
import tableOptions from "./tableOptions";
export default {
  name: "FacultyPending",
  data: () => ({
    table: tableOptions("reports.dates.sent", "Date Sent"),
  }),
  computed: {
    loading() {
      return this.$store.getters["request/getLoading"];
    },
    profileLoading() {
      return this.$store.getters["admin/getLoading"].profile;
    },
    pendings() {
      return this.$store.getters["request/getPendings"];
    },
  },
  methods: {
    getTimeOrDate(date) {
      return formatDistanceToNow(new Date(date)) + " ago";
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
    return this.$store.dispatch("request/Pendings", "provider");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start" v-if="!profileLoading">
      <v-col cols="12" class="pa-0">
        <v-container fluid class="pa-0">
          <v-row justify="space-between" align="start" class="pa-4">
            <v-col cols="8" sm="6" md="4" align-self="start">
              <span class="text-h6 warning--text font-weight-bold">
                Pending Requests
              </span>
            </v-col>
            <v-col cols="12" sm="6" md="5" v-if="pendings[0]" align-self="end">
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
        <v-container fluid v-if="pendings[0] && !loading.pendings">
          <v-data-table
            @click:row="goToView"
            :headers="table.headers"
            :items="pendings"
            :items-per-page="5"
            :search="table.search"
            class="elevation-0 data-table"
          >
            <template v-slot:[`item.user.profile`]="{ item }">
              {{ getFullname(item.user.profile[0].name) }}
            </template>

            <template v-slot:[`item.reports.dates.sent`]="{ item }">
              <v-chip
                small
                color="primary"
                class="pa-0 pr-2 pl-2 text-center text-caption"
              >
                {{ getTimeOrDate(item.reports.dates.sent) }}
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
        <v-container fluid v-else-if="loading.pendings">
          <v-skeleton-loader type="table" />
        </v-container>
        <v-container fluid v-else-if="!pendings[0] && !loading.pendings">
          <v-row justify="start">
            <v-col cols="12">
              <v-banner single-line>
                <v-icon slot="icon" color="warning" size="36">
                  mdi-exclamation-thick
                </v-icon>
                You have empty unsigned requests
              </v-banner>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row
      id="spinner-container"
      justify="center"
      align="center"
      v-else-if="profileLoading"
    >
      <v-col cols="12" align="center">
        <v-progress-circular :size="50" indeterminate color="primary" />
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.data-table {
  cursor: pointer;
}
</style>
