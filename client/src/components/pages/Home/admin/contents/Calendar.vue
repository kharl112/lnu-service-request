<script>
export default {
  name: "Calendar",
  props: {
    events: Array,
  },
  data: () => ({
    focus: "",
    type: "month",
    graphType: "monthly",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    chart: {
      options: {
        colors: ["#1976d2"],
        chart: {
          id: "occurences-chart",
          height: 350,
          zoom: {
            enabled: false,
          },
        },
        title: {
          text: "Monthly",
          align: "left",
        },
        subtitle: {
          text: "Requests sent",
          align: "left",
        },
        xaxis: {
          type: "category",
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return parseInt(val).toFixed(0);
            },
          },
        },
      },
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
          y: arr.filter((num) => num == item.x).length,
        };
      });
    },
    handleType(type) {
      this.type = type;
    },
    handleGraphType(type) {
      const _types = {
        weekly: this.weekly,
        monthly: this.monthly,
        annually: this.annually,
      };
      const graph_title = type.replace(/^[a-z]/, (first_letter) =>
        first_letter.toUpperCase()
      );

      //set graph type
      this.graphType = graph_title;

      const series = _types[type.toLowerCase()];
      this.$refs.chart.updateOptions({
        title: {
          text: graph_title,
        },
      });
      this.$refs.chart.updateSeries(series);
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
        y: 0,
        x: (week + 1).toString(),
      }));
      return [
        {
          name: "requests sent",
          data: this.getOccurences(
            this.events.map((item) => this.getWeek(item.start)),
            weeks
          ),
        },
      ];
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
      ].map((month) => ({ y: 0, x: month }));
      return [
        {
          name: "requests sent",
          data: this.getOccurences(
            this.events.map((item) => this.getMonth(item.start)),
            months
          ),
        },
      ];
    },
    annually() {
      const c_year = new Date().getFullYear();
      const years = [c_year - 3, c_year - 2, c_year - 1, c_year].map(
        (year) => ({ y: 0, x: year.toString() })
      );
      return [
        {
          name: "requests sent",
          data: this.getOccurences(
            this.events.map((item) => this.getYear(item.start)),
            years
          ),
        },
      ];
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
};
</script>
<template>
  <div>
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
            <v-list-item @click="handleType('day')">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="handleType('week')">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="handleType('month')">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
            <v-list-item @click="handleType('4day')">
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
    <v-subheader class="text-h6 px-0 mt-7">
      Graph
      <small class="text-caption ml-2"> (Request Sent) </small></v-subheader
    >
    <v-card class="pa-sm-7 pt-sm-0 pa-2">
      <v-toolbar flat>
        <v-row justify="space-between">
          <v-subheader class="text-overline pl-0">
            Total Requests: <strong>{{ events.length }}</strong>
          </v-subheader>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ graphType }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="handleGraphType('weekly')">
                <v-list-item-title>Weekly</v-list-item-title>
              </v-list-item>
              <v-list-item @click="handleGraphType('monthly')">
                <v-list-item-title>Monthly</v-list-item-title>
              </v-list-item>
              <v-list-item @click="handleGraphType('annually')">
                <v-list-item-title>Annually</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
      </v-toolbar>
      <apexchart
        ref="chart"
        width="100%"
        height="300"
        type="line"
        :options="chart.options"
        :series="monthly"
      />
    </v-card>
  </div>
</template>
