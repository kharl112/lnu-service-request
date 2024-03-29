<script>
import ActivityTimeline from "../contents/ActivityTimeline.vue";
export default {
  components: { ActivityTimeline },
  name: "FacultyDashboard",
  data: () => ({
    cards: [
      {
        title: "sent",
        icon: "send-check",
        description: "Sent service request from different service providers",
        color: "primary",
        getter: "Sent",
        link: "/faculty/home/sent",
      },
      {
        title: "pending received",
        icon: "email-multiple",
        description:
          "Received pending service Request from the other requestors",
        color: "warning",
        getter: "Pendings",
        link: "/faculty/home/pending",
      },
      {
        title: "signed",
        icon: "signature-freehand",
        description: "Signed service requests from the other requestors",
        color: "success",
        getter: "Signed",
        link: "/faculty/home/signed",
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
    isMobile() {
      const mobile = window.matchMedia("(max-width: 780px)");
      return mobile.matches;
    },
    getActivityLogLoading() {
      return this.$store.getters["activity_log/getLoading"].user;
    },
    activity_logs() {
      return this.$store.getters["activity_log/getActivityLogs"].slice(0, 4);
    },
    getFacultyProfile() {
      return this.$store.getters["faculty/getProfile"];
    },
    getFacultyFullName() {
      const { firstname, lastname, middle_initial, prefix, suffixes } =
        this.getFacultyProfile.name;
      return `${
        prefix ? prefix + "." : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${
        suffixes[0] ? suffixes.toString() : ""
      }`;
    },
    getFacultyInitials() {
      const { firstname, lastname } = this.getFacultyProfile.name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
    getAllUnits() {
      return this.$store.getters["unit/getAllUnits"];
    },
    getAllRoles() {
      return this.$store.getters["role/getAllRoles"];
    },
  },
  methods: {
    getUnitName(id) {
      if (!this.getAllUnits.length) return "";
      return this.getAllUnits.filter(({ _id }) => _id == id)[0].name;
    },
    getRoleName(id) {
      if (!this.getAllRoles.length) return "";
      return this.getAllRoles.filter(({ _id }) => _id == id)[0].name;
    },
    getLength(getter) {
      if (!getter) return 0;
      return this.$store.getters[`request/get${getter}`].length;
    },
    goToView(item) {
      const user_type =
        item.description.includes("signed") || item.description.includes("mark")
          ? "provider"
          : "user";
      this.$router.push(`/faculty/home/view/${user_type}/${item.request_id}`);
    },
  },
  created() {
    this.$store.dispatch("unit/allUnits");
    this.$store.dispatch("role/allRoles");
    this.$store.dispatch("request/Pendings", "provider");
    this.$store.dispatch("request/Sent");
    this.$store.dispatch("request/Signed", "provider");
    this.$store.dispatch("activity_log/userActivityLogs");
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
                  <v-list-item-avatar
                    tile
                    size="80"
                    :class="isMobile ? 'mx-2' : ''"
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
                  </v-list-item-avatar>

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

                <v-card-actions class="pa-2">
                  <v-btn
                    outlined
                    rounded
                    small
                    :color="card.color"
                    :to="card.link"
                    :block="isMobile"
                  >
                    View All
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <v-subheader class="text-h6">My Account</v-subheader>
        <v-container fluid>
          <v-card primary class="pt-5 pb-3">
            <v-list-item>
              <v-list-item-avatar size="50">
                <v-avatar color="primary" size="80">
                  <span class="white--text headline">
                    {{ getFacultyInitials }}
                  </span>
                </v-avatar>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ getFacultyFullName }}</v-list-item-title>
                <v-list-item-subtitle class="my-0 py-0">
                  ID: {{ getFacultyProfile.staff_id }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="my-0 pt-2">
                  Department:
                  <strong>{{
                    getUnitName(getFacultyProfile.department.unit_id)
                  }}</strong>
                </v-list-item-subtitle>
                <v-list-item-subtitle class="my-0 py-0">
                  Role:
                  <strong>
                    {{
                      getRoleName(getFacultyProfile.department.role_id)
                    }}</strong
                  >
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-card-actions>
              <v-btn outlined rounded small to="/faculty/home/settings">
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
                <v-btn outlined small to="/faculty/home/activity-log">
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
          <ActivityTimeline :limit="6" />
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss"></style>
