<script>
import { formatDistanceToNow } from "date-fns";
import tableOptions from "./tableOptions";

export default {
  name: "AdminPending",
  data: () => ({
    table: tableOptions,
    colors: ["primary", "warning", "error", "success"],
  }),
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getProfileLoading() {
      return this.$store.getters["admin/getLoading"].profile;
    },
    getAllPending() {
      return this.$store.getters["request/getAllPending"];
    },
  },
  methods: {
    getTimeOrDate(date) {
      return formatDistanceToNow(new Date(date), {
        includeSeconds: true,
      });
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
  },
  created() {
    return this.$store.dispatch("request/allPending", "admin");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start" v-if="!getProfileLoading">
      <v-col cols="12">
        <v-container fluid>
          <v-row justify="space-between" align="start" class="pa-4">
            <v-col cols="12" sm="6" md="4">
              <span class="h4 primary--text"> Pending Requests </span>
            </v-col>
            <v-col cols="12" sm="6" md="7" v-if="getAllPending[0]">
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
        <v-container fluid v-if="getAllPending[0] && !getLoading.all_pending">
          <v-data-table
            @click:row="(item) => $router.push(`/admin/home/view/${item._id}`)"
            :headers="table.headers"
            :items="getAllPending"
            :items-per-page="5"
            :search="table.search"
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
        <v-container fluid v-else-if="getLoading.all_pending">
          <v-skeleton-loader type="table" />
        </v-container>
        <v-container
          fluid
          v-else-if="!getAllPending[0] && !getLoading.all_pending"
        >
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
      v-else-if="getProfileLoading"
    >
      <v-col cols="12" align="center">
        <v-progress-circular :size="50" indeterminate color="primary" />
      </v-col>
    </v-row>
  </v-container>
</template>
