<script>
import ActivityTimeline from "../contents/ActivityTimeline.vue";
export default {
  components: { ActivityTimeline },
  name: "ActivityLogs",
  data: () => ({
    table: {
      headers: [
        {
          text: "Request Subject",
          value: "request.subject",
          sortable: true,
          align: "start",
        },
        {
          text: "Service Type",
          value: "request.service.type",
          sortable: true,
          align: "start",
        },
        {
          text: "Log",
          value: "description",
          sortable: true,
          align: "start",
        },

        {
          text: "Date",
          align: "start",
          value: "date",
          sortable: true,
        },
        {
          text: "Time",
          align: "start",
          value: "time",
          sortable: true,
        },
      ],
    },
  }),
  computed: {
    isMobile() {
      const mobile = window.matchMedia("(max-width: 780px)");
      return mobile.matches;
    },
    loading() {
      return this.$store.getters["activity_log/getLoading"].user;
    },
    activity_logs() {
      return this.$store.getters["activity_log/getActivityLogs"];
    },
  },
  methods: {
    goToView(item) {
      const user_type =
        item.description.includes("signed") || item.description.includes("mark")
          ? "provider"
          : "user";
      this.$router.push(`/faculty/home/view/${user_type}/${item.request_id}`);
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
  },
  created() {
    this.$store.dispatch("activity_log/userActivityLogs");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12" class="pa-0">
        <v-container fluid>
          <v-row
            :justify="!isMobile ? 'space-between' : 'center'"
            align="center"
            class="pb-4"
          >
            <v-col cols="12" sm="6" >
              <v-subheader
                :class="isMobile ? 'text-h6 text-center' : 'text-h5'"
              >
                Activity Logs
              </v-subheader>
            </v-col>
            <v-col cols="12" sm="6" md="4" v-if="!isMobile">
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

        <div v-if="!isMobile">
          <v-container fluid v-if="!loading">
            <v-data-table
              @click:row="goToView"
              :headers="table.headers"
              :items="activity_logs"
              :search="table.search"
              :items-per-page="5"
              class="elevation-0 data-table"
            >
              <template v-slot:[`item.request.subject`]="{ item }">
                <span>
                  {{ item.request.subject ? item.request.subject : "DELETED" }}
                </span>
              </template>
              <template v-slot:[`item.request.service.type`]="{ item }">
                <span>
                  {{
                    item.request.service ? item.request.service.type : "DELETED"
                  }}
                </span>
              </template>

              <template v-slot:[`item.date`]="{ item }">
                <span>
                  {{
                    new Date(item.date).toLocaleString("default", {
                      dateStyle: "medium",
                    })
                  }}
                </span>
              </template>
              <template v-slot:[`item.time`]="{ item }">
                <span>
                  {{
                    new Date(item.date).toLocaleString("default", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  }}
                </span>
              </template>
            </v-data-table>
          </v-container>
          <v-container fluid v-else-if="loading">
            <v-skeleton-loader type="table" />
          </v-container>
        </div>

        <div v-else>
          <v-container fluid>
            <ActivityTimeline />
            <v-col class="text-center pt-5"> End of results </v-col>
          </v-container>
        </div>
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
