<script>
export default {
  name: "Drafts",
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getError() {
      return this.$store.getters["request/getError"];
    },
    getAllDraft() {
      return this.$store.getters["request/getAllDraft"];
    },
  },
  methods: {
    getTimeOrDate(date) {
      const now = new Date();
      const created = new Date(date);
      const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEPT",
        "OCT",
        "NOV",
        "DEC",
      ];
      const day = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
      return now.getFullYear() === created.getFullYear()
        ? now.getMonth() === created.getMonth()
          ? now.getDate() === created.getDate()
            ? now.getHours() === created.getHours()
              ? now.getMinutes() === created.getMinutes()
                ? now.Seconds() === created.Seconds()
                  ? ""
                  : `${now.Seconds() - created.Seconds()} sec ago`
                : `${now.getMinutes() - created.getMinutes()} min ago`
              : `${now.getHours() - created.getHours()} hr ago`
            : `${day[created.getDay()]} ago`
          : `${months[created.getMonth()]} ago`
        : `${created.getFullYear()} ago`;
    },
  },
  created() {
    return this.$store.dispatch("request/allDraft");
  },
};
</script>
<template>
  <v-container fluid id="draft-container">
    <v-row dense justify="start" justify-sm="start" justify-md="center">
      <v-col cols="12" sm="12" md="8">
        <v-simple-table v-if="!getLoading.all_draft && !getError.all_draft">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left"></th>
                <th class="text-left">
                  Subject
                </th>
                <th class="text-left">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="draft in getAllDraft" :key="draft.name">
                <td><v-checkbox /></td>
                <td>{{ draft.subject }}</td>
                <td>{{ getTimeOrDate(draft.date) }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-skeleton-loader type="table" v-else />
      </v-col>
      <v-divider class="hidden-sm-and-down" vertical />
      <v-col md="4" class="hidden-sm-and-down">
        <v-row>
          <v-col cols="12">
            <v-container fluid>
              <v-card outlined >
                <v-img
                  src="https://anlantawan.files.wordpress.com/2020/08/ellenyu.jpg?w=720"
                  height="200px"
                ></v-img>
                <v-card-subtitle clas="blue--text">
                  Leyte Normal University Requesting Guidlines
                </v-card-subtitle>
                <v-divider />
                <v-list-item>
                  1. Be polite
                </v-list-item>
              </v-card>
            </v-container>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
