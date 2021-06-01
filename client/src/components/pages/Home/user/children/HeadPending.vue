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
    show: false,
  }),
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getProfileLoading() {
      return this.$store.getters["faculty/getLoading"].profile;
    },
    getAllPending() {
      return this.$store.getters["request/getAllPending"];
    },
    getPDFLoading() {
      return this.$store.getters["pdf/getLoading"];
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
        .replace('height="300"', 'height="175" viewBox="0 0 300 175"');

      return this.$store.dispatch("request/signRequest", {
        request_id: this.selectedRequest,
        signature,
        type: "head",
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
  <v-container fluid class="pa-3">
    <v-row dense justify="start" v-if="!getProfileLoading">
      <v-col
        cols="12"
        sm="12"
        md="8"
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
              No pending request received yet
            </v-banner>
          </v-col>
        </v-row>
      </v-col>
      <v-divider class="hidden-sm-and-down" vertical />
      <v-col md="4" class="hidden-sm-and-down">
        <v-row>
          <v-col cols="12">
            <v-container fluid>
              <v-card class="mx-auto" max-width="344">
                <v-img
                  src="https://www.windowsphonefr.com/wp-content/uploads/2019/05/ThinkstockPhotos-187625854.jpg"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  class="white--text align-end"
                  width="720px"
                  height="auto"
                >
                  <v-card-title>
                    Requesting Services in LNU
                  </v-card-title>
                </v-img>

                <v-card-actions>
                  <v-btn color="warning" text>
                    Contact Us
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="show = !show">
                    <v-icon>{{
                      show ? "mdi-chevron-up" : "mdi-chevron-down"
                    }}</v-icon>
                  </v-btn>
                </v-card-actions>

                <v-expand-transition>
                  <div v-show="show">
                    <v-divider></v-divider>
                    <v-card-text>
                      Leyte Normal University <br />
                      Paterno Street Tacloban City 6500 <br />
                      +63 (53) 832 3205 info@lnu.edu.ph <br />
                      www.facebook.com/lnuofficial
                    </v-card-text>
                  </div>
                </v-expand-transition>
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
    </v-row>
    <SetSignature
      :signatureVisibility="signatureVisibility"
      :showSignature="showSignature"
      :handleSetSignature="handleSetSignature"
    />
  </v-container>
</template>
