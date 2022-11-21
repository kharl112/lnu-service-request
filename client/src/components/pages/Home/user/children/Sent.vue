<script>
import { formatDistanceToNow } from "date-fns";
import ActivityTimeline from "../contents/ActivityTimeline.vue";
export default {
  name: "Sent",
  components: { ActivityTimeline },
  data: () => ({
    table: {
      headers: [
        {
          text: "Service Type",
          align: "left",
          sortable: true,
          value: "service[0].type",
        },
        {
          text: "Description",
          align: "left",
          sortable: true,
          value: "subject",
        },
        {
          text: "Date Sent",
          align: "left",
          sortable: true,
          value: "reports.dates.sent",
        },
        {
          text: "Status",
          align: "left",
          sortable: true,
          value: "reports.status",
        },
      ],
    },
  }),
  computed: {
    loading() {
      return this.$store.getters["request/getLoading"];
    },
    sent() {
      return this.$store.getters["request/getSent"];
    },
  },
  methods: {
    getTimeOrDate(date) {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        includeSeconds: true,
      }).replace("about ", "");
    },
    goToCreate() {
      return this.$router.push(`/faculty/home/compose`);
    },
    goToView(item) {
      this.$router.push(`/faculty/home/view/user/${item._id}`);
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
  },
  created() {
    this.$store.dispatch("request/Sent");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12" md="8" class="pa-0">
        <v-container fluid>
          <v-row justify="space-between" class="pb-4">
            <v-col cols="12" sm="6">
              <v-subheader class="text-h6"> Sent Service Requests </v-subheader>
            </v-col>
            <v-col cols="12" sm="6" md="6">
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
        <v-container fluid v-if="!loading.sent">
          <v-data-table
            @click:row="goToView"
            :headers="table.headers"
            :items="sent"
            :search="table.search"
            :items-per-page="5"
            class="elevation-0 data-table"
          >
            <template v-slot:[`item.user.profile`]="{ item }">
              <span id="clickable">
                {{ getFullname(item.user.profile[0].name) }}
              </span>
            </template>
            <template v-slot:[`item.reports.dates.sent`]="{ item }">
              <v-chip
                small
                color="primary"
                class="pa-0 pr-2 pl-2 text-center text-caption"
                id="clickable"
              >
                {{ getTimeOrDate(item.reports.dates.sent) }}
              </v-chip>
            </template>
            <template v-slot:[`item.reports.status`]="{ item }">
              <span
                id="clickable"
                :class="`text-overline font-weight-bold ${
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
        <v-container fluid v-else-if="loading.sent">
          <v-skeleton-loader type="table" />
        </v-container>
      </v-col>
      <v-divider vertical class="d-md-flex d-sm-none d-none" />
      <v-col cols="4" class="px-4 d-md-block d-sm-none d-none">
        <ActivityTimeline :limit="4" />
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
.data-table {
  cursor: pointer;
}
</style>
