<script>
import ActivityTimeline from "../contents/ActivityTimeline.vue";
import Calendar from "../contents/Calendar.vue";
export default {
  name: "AdminDashboard",
  components: { ActivityTimeline, Calendar },
  data: () => ({
    cards: [
      {
        title: "pending received",
        icon: "email-multiple",
        description:
          "Received pending service requests from the other requestors",
        color: "primary",
        getter: "Pendings",
        link: "/admin/home/pending",
      },
      {
        title: "signed",
        icon: "signature-freehand",
        description: "Service requests you already signed",
        color: "success",
        getter: "Signed",
        link: "/admin/home/signed",
      },
      {
        title: "archives",
        icon: "archive",
        description: "Archived service requests ",
        color: "warning",
        getter: "Archives",
        link: "/admin/home/archives",
      },
    ],
    headers: [
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
      {
        text: "Log",
        value: "description",
        sortable: true,
        align: "start",
      },
    ],
  }),
  computed: {
    getAllRequests() {
      const all = this.$store.getters["request/getAll"];
      return all.map((item) => ({
        data: item._id,
        start: new Date(item.schedule_date).toISOString().split("T")[0],
        schedule_date: new Date(item.reports.dates.sent)
          .toISOString()
          .split("T")[0],
        color:
          item.reports.status == "rejected"
            ? "error"
            : item.reports.status == "archived"
            ? "warning"
            : item.admin.signature
            ? "success"
            : "primary",
        name:
          item.user.profile[0].name.firstname + " - " + item.service[0].type,
      }));
    },
    isMobile() {
      const mobile = window.matchMedia("(max-width: 780px)");
      return mobile.matches;
    },
    getActivityLogLoading() {
      return this.$store.getters["activity_log/getLoading"].admin;
    },
    activity_logs() {
      return this.$store.getters["activity_log/getActivityLogs"].slice(0, 4);
    },
    getAdminProfile() {
      return this.$store.getters["admin/getProfile"];
    },
    getAdminFullName() {
      const { firstname, lastname, middle_initial, prefix, suffixes } =
        this.getAdminProfile.name;
      return `${
        prefix ? prefix + "." : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${
        suffixes[0] ? suffixes.toString() : ""
      }`;
    },
    getAdminInitials() {
      const { firstname, lastname } = this.getAdminProfile.name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
  },
  methods: {
    getLength(getter) {
      if (!getter) return 0;
      return this.$store.getters[`request/get${getter}`].length;
    },
    goToView(item) {
      this.$router.push(`/admin/home/view/${item.request_id}`);
    },
  },
  created() {
    this.$store.dispatch("request/All", "admin");
    this.$store.dispatch("request/Pendings", "admin");
    this.$store.dispatch("request/Signed", "admin");
    this.$store.dispatch("request/Archives", "admin");
    this.$store.dispatch("activity_log/adminActivityLogs");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense>
      <v-col cols="2">
        <v-row dense>
          <v-col cols="12" sm="6" md="4" align-self="end">
            <v-subheader class="text-h5 pl-3 font-weight-bold">
              Dashboard
            </v-subheader>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="my-2">
        <v-container fluid>
          <v-row justify="center">
            <v-col cols="4" md="4" v-for="(card, index) in cards" :key="index">
              <v-card primary :class="!isMobile ? 'pa-3' : ''">
                <v-list-item three-line>
                  <v-col
                    :cols="isMobile ? '12' : '4'"
                    :class="isMobile ? 'text-center pa-0' : 'pa-0'"
                  >
                    <v-badge
                      v-if="isMobile"
                      :color="card.color"
                      :content="getLength(card.getter) || '0'"
                    >
                      <v-icon
                        :size="isMobile ? '25' : '70'"
                        :color="card.color"
                      >
                        mdi-{{ card.icon }}
                      </v-icon>
                    </v-badge>
                    <v-icon
                      v-else
                      :size="isMobile ? '25' : '70'"
                      :color="card.color"
                    >
                      mdi-{{ card.icon }}
                    </v-icon>
                  </v-col>
                  <v-list-item-content v-if="!isMobile">
                    <v-list-item-title class="text-h5 font-weight-bold">
                      {{ getLength(card.getter) || "0" }}
                      <span
                        class="text-body-1 font-weight-bold text-uppercase"
                        >{{ card.title }}</span
                      >
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ card.description }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-card-actions>
                  <v-btn
                    outlined
                    rounded
                    small
                    :color="card.color"
                    :to="card.link"
                    :block="isMobile"
                  >
                    See more
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" class="pa-4 mb-3">
        <v-subheader class="text-h6 pa-0 mb-3">
          Calendar <small class="caption ml-2">(Request schedule dates)</small>
        </v-subheader>
        <Calendar :events="getAllRequests" />
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <v-subheader class="text-h6">My Account</v-subheader>
        <v-container fluid>
          <v-card primary class="pt-5 pb-3">
            <v-list-item>
              <v-list-item-avatar size="50">
                <v-avatar color="primary" size="80">
                  <span class="white--text headline">
                    {{ getAdminInitials }}
                  </span>
                </v-avatar>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ getAdminFullName }}</v-list-item-title>
                <v-list-item-subtitle class="my-0 py-0">
                  ID: {{ getAdminProfile.staff_id }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="my-0 pt-2">
                  Department:
                  <strong>Chief Administration Office</strong>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-card-actions>
              <v-btn outlined rounded small to="/admin/home/settings">
                Settings
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-col>
      <v-col cols="12" sm="12" md="8" v-if="!isMobile">
        <v-subheader class="text-h6"> Recent Activities </v-subheader>
        <v-container fluid v-if="!getActivityLogLoading">
          <v-data-table
            :headers="headers"
            :items="activity_logs"
            class="elevation-1"
            hide-default-footer
          >
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
            <template v-slot:footer v-if="activity_logs.length">
              <v-toolbar flat>
                <v-btn outlined small to="/admin/home/activity-log">
                  <v-icon left>mdi-cogs</v-icon>
                  View All Activities
                </v-btn>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-container>
        <v-container fluid v-else>
          <v-skeleton-loader type="table" height="240px" />
        </v-container>
      </v-col>
      <v-col cols="12" sm="12" md="8" v-else>
        <v-container fluid>
          <ActivityTimeline :limit="4" />
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss"></style>
