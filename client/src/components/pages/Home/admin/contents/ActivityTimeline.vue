<script>
export default {
  name: "ActivityTimeline",
  props: { limit: Number },
  computed: {
    loading() {
      return this.$store.getters["activity_log/getLoading"].admin;
    },
    activity_logs() {
      if (this.limit)
        return this.$store.getters["activity_log/getActivityLogs"].slice(
          0,
          this.limit
        );
      return this.$store.getters["activity_log/getActivityLogs"];
    },
  },
  methods: {
    getColorIcon(item) {
      if (item.description.includes("create"))
        return { icon: "mdi-plus", color: "primary" };
      if (item.description.includes("archive"))
        return { icon: "mdi-archive", color: "warning" };
      if (item.description.includes("completed"))
        return { icon: "mdi-check", color: "primary" };
      if (item.description.includes("signed"))
        return { icon: "mdi-draw", color: "success" };
      if (item.description.includes("delete"))
        return { icon: "mdi-delete", color: "error" };
      return { icon: "mdi-close", color: "error" };
    },
    getTime(date) {
      return new Date(date).toLocaleString("default", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    },
    getDate(date) {
      return new Date(date).toLocaleString("default", {
        dateStyle: "medium",
      });
    },
  },
  created() {
    this.$store.dispatch("activity_log/adminActivityLogs");
  },
};
</script>
<template>
  <v-card class="py-4 px-2" width="100%" :outlined="!this.limit">
    <v-subheader class="text-h6" v-if="this.limit">
      Activity Log Timeline
    </v-subheader>
    <v-timeline align-top dense v-if="!loading && activity_logs.length">
      <v-timeline-item
        :color="getColorIcon(item).color"
        small
        v-for="(item, index) in activity_logs"
        :key="index"
        fill-dot
        :icon="getColorIcon(item).icon"
      >
        <v-row class="pt-1">
          <v-col cols="3">
            <strong class="text-caption">{{ getTime(item.date) }}</strong>
          </v-col>
          <v-col>
            <strong>
              {{ item.request.service ? item.request.service.type : "N/A" }}
            </strong>
            <div class="text-caption">
              {{ item.description }}
            </div>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
    <v-container fluid v-else-if="loading">
      <v-skeleton-loader
        type="list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line"
        height="100%"
      />
    </v-container>
    <v-card-title
      class="text--grey py-0 text-body-1 text--secondary"
      v-else-if="!loading && !activity_logs.length"
    >
      No activity logs
    </v-card-title>
    <v-card-actions v-if="this.limit">
      <v-btn small color="primary" elevation="0" to="/admin/home/activity-log">
        View All
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
