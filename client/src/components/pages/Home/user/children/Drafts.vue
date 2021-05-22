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
    selected: {
      get() {
        return this.$store.getters["request/getSelected"];
      },
      set(selected) {
        return this.$store.commit("request/setSelected", selected);
      },
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
    gotoEdit(id) {
      return this.$router.push(`/faculty/home/edit/letter=${id}`);
    },
    gotoCreate() {
      return this.$router.push(`/faculty/home/compose`);
    },
  },
  created() {
    return this.$store.dispatch("request/allDraft");
  },
};
</script>
<template>
  <v-container fluid class="pa-0">
    <v-row dense justify="start" v-if="!getLoading.letter_info">
      <v-col
        cols="12"
        sm="12"
        md="8"
        class="pl-5 pl-sm-0 pl-md-4 pl-lg-0"
        v-if="getAllDraft[0] && !getLoading.all_draft"
      >
        <v-simple-table>
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
                <td>
                  <v-checkbox v-model="selected" :value="draft._id" />
                </td>
                <td @click="gotoEdit(draft._id)">
                  {{ draft.subject }}
                </td>
                <td @click="gotoEdit(draft._id)">
                  <small>{{ getTimeOrDate(draft.date) }}</small>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="12" sm="12" md="8" v-else-if="getLoading.all_draft">
        <v-skeleton-loader type="table" />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="8"
        v-else-if="!getAllDraft[0] && !getLoading.all_draft"
      >
        <v-row justify="start">
          <v-col cols="12">
            <v-banner single-line>
              <v-icon slot="icon" color="warning" size="36">
                mdi-exclamation-thick
              </v-icon>
              You have empty unsent requests
              <template v-slot:actions>
                <v-btn color="primary" @click="gotoCreate" text>
                  make one
                </v-btn>
              </template>
            </v-banner>
          </v-col>
        </v-row>
      </v-col>
      <v-divider class="hidden-sm-and-down" vertical />
      <v-col md="4" class="hidden-sm-and-down">
        <v-row>
          <v-col cols="12">
            <v-container fluid>
              <v-card outlined>
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
    <v-row
      id="spinner-container"
      justify="center"
      align="center"
      v-else-if="getLoading.letter_info"
    >
      <v-col cols="12" align="center">
        <v-progress-circular
          :size="50"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>
