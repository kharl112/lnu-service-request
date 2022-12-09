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
    getWeek(date) {
      const currentDate = new Date(date);
      const startDate = new Date(currentDate.getFullYear(), 0, 1);
      const days = Math.floor(
        (currentDate - startDate) / (24 * 60 * 60 * 1000)
      );
      const weekNumber = Math.ceil(days / 7);
      return weekNumber;
    },
    getMonth(date) {
      return new Date(date).toLocaleString("en-us", { month: "short" });
    },
    getYear(date) {
      return new Date(date).getFullYear();
    },
    getOccurences(arr, placeholder = []) {
      return placeholder.map((item) => {
        return {
          ...item,
          count: arr.filter((num) => num == item.index).length,
        };
      });
    },
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
    weekly() {
      const weeks = [...Array(52).keys()].map((week) => ({
        count: 0,
        index: week + 1,
      }));
      return this.getOccurences(
        this.events.map((item) => this.getWeek(item.start)),
        weeks
      );
    },
    monthly() {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((month) => ({ count: 0, index: month }));
      return this.getOccurences(
        this.events.map((item) => this.getMonth(item.start)),
        months
      );
    },
    yearly() {
      const c_year = new Date().getFullYear();
      const years = [c_year - 3, c_year - 2, c_year - 1, c_year].map(
        (year) => ({ count: 0, index: year })
      );

      return this.getOccurences(
        this.events.map((item) => this.getYear(item.start)),
        years
      );
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  updated() {
    console.log(this.weekly);
    console.log(this.monthly);
    console.log(this.yearly);
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
