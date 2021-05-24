<script>
import SetSignature from "../contents/SetSignature";
export default {
  name: "HeadPending",
  components: {
    SetSignature,
  },
  data: () => ({
    signatureVisibility: false,
    selectedRequest: "",
    timeout: 3000,
  }),
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getError() {
      return this.$store.getters["request/getError"];
    },
    getProfileLoading() {
      return this.$store.getters["faculty/getLoading"].profile;
    },
    getAllPending() {
      return this.$store.getters["request/getAllPending"];
    },
    getSignError() {
      return this.$store.getters["request/getError"].sign;
    },
    getSnackbar() {
      return this.$store.getters["request/getSnackbar"];
    },
    getPDFLoading() {
      return this.$store.getters["pdf/getLoading"];
    },
    getPDFError() {
      return this.$store.getters["pdf/getError"];
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
      return now.getFullYear() >= created.getFullYear()
        ? now.getMonth() <= created.getMonth()
          ? now.getDate() <= created.getDate()
            ? now.getHours() <= created.getHours()
              ? now.getMinutes() <= created.getMinutes()
                ? now.getSeconds() <= created.getSeconds()
                  ? ""
                  : `${now.Seconds() - created.Seconds()} sec ago`
                : `${now.getMinutes() - created.getMinutes()} min ago`
              : `${now.getHours() - created.getHours()} hr ago`
            : `Last ${day[created.getDay()]}`
          : `Last ${months[created.getMonth()]}`
        : `Last year${created.getFullYear()}`;
    },
    showSignature(request_id = "") {
      this.selectedRequest = request_id;
      this.signatureVisibility = !this.signatureVisibility;
    },
    handleSetSignature(signatureId) {
      const signature = document
        .getElementById(signatureId)
        .innerHTML.toString()
        .replace('height="300"', 'height="150" viewBox="0 0 300 150"');

      return this.$store.dispatch("request/signRequest", {
        request_id: this.selectedRequest,
        signature,
        type: "head",
      });
    },
    closeSnackbar() {
      return this.$store.commit("request/setSnackbar", {
        snackbar: false,
        type: "sign",
      });
    },
    downloadPDF(id) {
      return this.$store.dispatch("pdf/generatePDF", {
        user_type: "head",
        id,
      });
    },
  },
  created() {
    return this.$store.dispatch("request/allPending", "head");
  },
};
</script>
<template>
  <v-container fluid class="pa-0">
    <v-row dense justify="start" v-if="!getProfileLoading">
      <v-col
        cols="12"
        sm="12"
        md="8"
        class="pl-5 pl-sm-0 pl-md-4 pl-lg-0"
        v-if="getAllPending[0] && !getLoading.all_pending"
      >
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Subject
                </th>
                <th class="text-left">
                  Date
                </th>
                <th class="text-left"></th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pending in getAllPending" :key="pending.name">
                <td>
                  {{ pending.subject }}
                </td>
                <td>
                  <small>{{ getTimeOrDate(pending.date) }}</small>
                </td>
                <td>
                  <v-btn
                    elevation="0"
                    fab
                    dark
                    small
                    color="success"
                    @click="showSignature(pending._id)"
                  >
                    <v-icon dark>
                      mdi-signature-freehand
                    </v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-btn
                    elevation="0"
                    fab
                    dark
                    small
                    color="error"
                    :disabled="getPDFLoading"
                    @click="downloadPDF(pending._id)"
                  >
                    <v-icon dark>
                      mdi-cloud-download
                    </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="12" sm="12" md="8" v-else-if="getLoading.all_pending">
        <v-skeleton-loader type="table" />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="8"
        v-else-if="!getAllPending[0] && !getLoading.all_pending"
      >
        <v-row justify="start">
          <v-col cols="12">
            <v-banner single-line>
              <v-icon slot="icon" color="warning" size="36">
                mdi-exclamation-thick
              </v-icon>
              You have'nt received service request yet
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
      v-else-if="getProfileLoading"
    >
      <v-col cols="12" align="center">
        <v-progress-circular :size="50" indeterminate color="primary" />
      </v-col>
      <v-snackbar color="error" v-model="getSnackbar.sign">
        {{ getSignError }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="closeSnackbar">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
    <SetSignature
      :signatureVisibility="signatureVisibility"
      :showSignature="showSignature"
      :handleSetSignature="handleSetSignature"
    />
  </v-container>
</template>
