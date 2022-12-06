<script>
export default {
  name: "Calendar",
  props: {
    events: Array,
  },
  data: () => ({
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
  }),
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    goToView({ event }) {
      this.$router.push(`/admin/home/view/${event.data}`);
    },
  },
  computed: {
    isMobile() {
      const mobile = window.matchMedia("(max-width: 780px)");
      return mobile.matches;
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
};
</script>
<template>
  <v-card>
    <v-toolbar flat>
      <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
        Today
      </v-btn>
      <v-btn fab text small color="grey darken-2" @click="prev">
        <v-icon small> mdi-chevron-left </v-icon>
      </v-btn>
      <v-btn fab text small color="grey darken-2" @click="next">
        <v-icon small> mdi-chevron-right </v-icon>
      </v-btn>
      <v-toolbar-title v-if="$refs.calendar && !isMobile">
        {{ $refs.calendar.title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
            <span>{{ typeToLabel[type] }}</span>
            <v-icon right> mdi-menu-down </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="type = 'day'">
            <v-list-item-title>Day</v-list-item-title>
          </v-list-item>
          <v-list-item @click="type = 'week'">
            <v-list-item-title>Week</v-list-item-title>
          </v-list-item>
          <v-list-item @click="type = 'month'">
            <v-list-item-title>Month</v-list-item-title>
          </v-list-item>
          <v-list-item @click="type = '4day'">
            <v-list-item-title>4 days</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-calendar
      ref="calendar"
      v-model="focus"
      :type="type"
      @click:more="viewDay"
      @click:date="viewDay"
      @click:event="goToView"
      :events="events"
    >
    </v-calendar>
  </v-card>
</template>