<script>
import { formatDistanceToNow } from "date-fns";

export default {
  name: "Notifications",
  data: () => ({ selected: [] }),
  computed: {
    loading() {
      return this.$store.getters["notification/getLoading"].faculty;
    },
    notifications() {
      return this.$store.getters["notification/getNotifications"];
    },
    filter: {
      get() {
        return this.$route.query.filter;
      },
      set(filter) {
        this.filterNotif(filter);
        return this.$router.replace({
          path: "/faculty/home/notification",
          query: { filter: filter },
        });
      },
    },
  },
  methods: {
    goToView(item) {
      const user_type = item.description.toLowerCase().includes("for you")
        ? "provider"
        : "user";
      this.$router.push(`/faculty/home/view/${user_type}/${item.request_id}`);
    },
    filterNotif(filter) {
      this.$store.dispatch("notification/notifications", {
        user_type: "faculty",
        filter,
      });
    },
    markAsRead(item) {
      if (item.unread)
        this.$store.dispatch("notification/markAsRead", {
          user_type: "faculty",
          notification_id: item._id,
        });

      this.goToView(item);
    },
    markAllAsRead() {
      this.$store.dispatch("notification/markAllAsRead", "faculty");
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    getFacultyInitials(name) {
      const { firstname, lastname } = name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
    getAvatarColor(user_type) {
      if (user_type === "user") return "warning";
      return "warning";
    },
    getTimeOrDate(date) {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        includeSeconds: true,
      }).replace("about ", "");
    },
    getColorIcon(item) {
      if (item.description.toLowerCase().includes("create"))
        return { icon: "mdi-plus", color: "primary" };
      if (item.description.toLowerCase().includes("archive"))
        return { icon: "mdi-archive", color: "warning" };
      if (item.description.toLowerCase().includes("completed"))
        return { icon: "mdi-check", color: "success" };
      if (item.description.toLowerCase().includes("signed"))
        return { icon: "mdi-check", color: "success" };
      if (item.description.toLowerCase().includes("delete"))
        return { icon: "mdi-delete", color: "error" };
      if (item.description.toLowerCase().includes("sent"))
        return { icon: "mdi-send", color: "primary" };
      return { icon: "mdi-close", color: "error" };
    },
  },
  created() {
    this.filterNotif(this.filter);
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="space-between">
      <v-col cols="12">
        <v-subheader class="text-h5"> Notifications </v-subheader>
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="12" md="3">
        <v-row>
          <v-col cols="6" md="12">
            <v-subheader class="text-body-1 px-0">Filter</v-subheader>
            <v-container fluid>
              <v-row justify="start">
                <v-chip-group
                  v-model="filter"
                  active-class="primary--text"
                  column
                  :value="filter"
                >
                  <v-chip class="mr-2" filter value="all"> All </v-chip>
                  <v-chip class="mx-2" filter value="unread"> Unread </v-chip>
                  <v-chip class="mx-2" filter value="read"> Read </v-chip>
                </v-chip-group>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="6" md="12">
            <v-subheader class="text-body-1 px-0">Actions</v-subheader>
            <v-container fluid>
              <v-row justify="start">
                <v-chip-group active-class="primary--text" column>
                  <v-chip class="mr-2" @click="markAllAsRead()">
                    Mark all as read
                  </v-chip>
                </v-chip-group>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="d-flex d-sm-none d-md-none my-2">
        <v-divider />
      </v-col>
      <v-divider class="d-none d-sm-flex d-md-flex col-divider" vertical />
      <v-col cols="12" md="8" class="notification-container">
        <v-list three-line width="100%" v-if="!loading">
          <v-list-item-group>
            <template>
              <v-list-item
                v-for="item in notifications"
                :key="item._id"
                @click="markAsRead(item)"
              >
                <v-list-item-avatar>
                  <v-avatar :color="getColorIcon(item).color">
                    <v-icon color="white">{{ getColorIcon(item).icon }}</v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.request ? item.request.service.type : 'DELETE'"
                  ></v-list-item-title>

                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="getFullname(item.initiator)"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-text="item.description"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text
                    v-text="getTimeOrDate(item.date)"
                  ></v-list-item-action-text>

                  <v-icon
                    v-if="item.unread"
                    color="primary"
                    size="15"
                    class="mt-5"
                  >
                    mdi-circle
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list-item-group>

          <p class="text-center caption mt-5">End of results</p>
        </v-list>

        <v-skeleton-loader
          type="list-item-avatar-three-line@4"
          v-else-if="loading"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.col-divider {
  min-height: 70vh;
}
.notification-container {
  height: 80vh;
  overflow-y: auto;
}
</style>
