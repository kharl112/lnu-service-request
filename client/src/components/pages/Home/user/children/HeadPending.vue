<script>
import SetSignature from "../contents/SetSignature";
import { formatDistanceToNow } from "date-fns";
export default {
  name: "HeadPending",
  components: {
    SetSignature,
  },
  data: () => ({
    signatureVisibility: false,
    selectedRequest: "",
    show: false,
    colors: ["primary", "warning", "error", "success"],
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
    getTimeOrDate(date) {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        includeSeconds: true,
      });
    },
    downloadPDF(id) {
      return this.$store.dispatch("pdf/generatePDF", {
        user_type: "head",
        id,
      });
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    getInitials(name) {
      const { firstname, lastname } = name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
    getRandomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
  },
  created() {
    return this.$store.dispatch("request/allPending", "head");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start" v-if="!getProfileLoading">
      <v-col
        cols="12"
        sm="12"
        md="8"
        v-if="getAllPending[0] && !getLoading.all_pending"
      >
        <v-expansion-panels accordion hover>
          <v-expansion-panel
            outlined
            v-for="pending in getAllPending"
            :key="pending.name"
          >
            <v-expansion-panel-header>
              <div align="left" class="hidden-sm-and-down pr-3">
                <v-avatar size="40" :color="getRandomColor()">
                  <span class="white--text text-subtitle-1">{{
                    getInitials(pending.user.profile[0].name)
                  }}</span>
                </v-avatar>
              </div>
              <v-list-item-subtitle
                align="left"
                class="pa-0 mr-4 text-caption text-left text-sm-body-2 "
              >
                {{ pending.subject }}
              </v-list-item-subtitle>
              <div align="right" class="hidden-sm-and-down">
                <v-chip
                  small
                  max-width="70px"
                  class="ma-2 text-center caption"
                  color="primary"
                >
                  {{ getTimeOrDate(pending.date) }}
                </v-chip>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-divider />
              <v-container>
                <v-row>
                  <v-col cols="12" class="pa-1 pl-0">
                    <v-card-subtitle class="pa-0 text-caption ">
                      {{ getFullname(pending.user.profile[0].name) }}
                      <span class="hidden-sm-and-down font-italic">
                        -
                        {{
                          `${pending.user.department.role[0].name} of ${pending.user.department.unit[0].name}`
                        }}
                      </span>
                    </v-card-subtitle>
                  </v-col>
                  <v-col
                    cols="12"
                    class="pa-1 pl-0"
                    v-if="pending.head.profile[0]"
                  >
                    <v-card-subtitle class="pa-0 text-caption ">
                      {{ getFullname(pending.admin.profile[0].name) }}
                      <span class="hidden-sm-and-down font-italic">
                        - Chief Administration Office
                      </span>
                    </v-card-subtitle>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider />
              <v-card-subtitle
                class="pa-0 pb-2 pt-2 text-caption text-no-wrap font-weight-bold primary--text"
              >
                {{ pending.service[0].type }}
                <span
                  class="font-weight-normal secondary--text hidden-md-and-up"
                >
                  &#40;
                  {{ getTimeOrDate(pending.date) }}
                  &#41;
                </span>
              </v-card-subtitle>
              <v-card-subtitle
                class="pa-0 pb-2 text-caption text-justify text-sm-body-2"
              >
                {{ pending.body }}
              </v-card-subtitle>
              <v-spacer />
              <v-divider />
              <v-card-actions class="pa-3 pt-3 pb-3">
                <v-row justify="start" align="center">
                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    align="start"
                    class="pa-2 pl-0"
                  >
                    <v-btn
                      small
                      block
                      min-width="50px"
                      elevation="0"
                      color="success"
                      @click="showSignature(pending._id)"
                    >
                      Sign
                      <v-icon right>
                        mdi-signature-freehand
                      </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    align="start"
                    class="pa-2 pl-0"
                  >
                    <v-btn
                      small
                      block
                      min-width="50px"
                      elevation="0"
                      color="error"
                      :disabled="getPDFLoading"
                      @click="downloadPDF(pending._id)"
                    >
                      Download
                      <v-icon right>
                        mdi-cloud-download
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
