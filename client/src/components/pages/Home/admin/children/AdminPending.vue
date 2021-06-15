<script>
import SetSignature from "../contents/SetSignature";
import { formatDistanceToNow } from "date-fns";
export default {
  name: "AdminPending",
  components: {
    SetSignature,
  },
  data: () => ({
    signatureVisibility: false,
    selectedRequest: "",
    colors: ["primary", "warning", "error", "success"],
  }),
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getProfileLoading() {
      return this.$store.getters["admin/getLoading"].profile;
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
      return formatDistanceToNow(new Date(date), {
        includeSeconds: true,
      });
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
        type: "admin",
      });
    },
    downloadPDF(id) {
      return this.$store.dispatch("pdf/generatePDF", {
        user_type: "admin",
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
    return this.$store.dispatch("request/allPending", "admin");
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
                      {{ getFullname(pending.head.profile[0].name) }}
                      <span class="hidden-sm-and-down font-italic">
                        -
                        {{
                          `${pending.head.department.role[0].name} of ${pending.head.department.unit[0].name}`
                        }}
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
                <span class="font-weight-normal secondary--text hidden-md-and-up">
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
              No pending request
            </v-banner>
          </v-col>
        </v-row>
      </v-col>
      <v-divider class="hidden-sm-and-down" vertical />
      <v-col md="4" class="hidden-sm-and-down">
        <v-row>
          <v-col cols="12">
            <v-container fluid>
              <v-card>
                <v-img
                  src="https://anlantawan.files.wordpress.com/2020/08/ellenyu.jpg?w=720"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  width="720px"
                  height="auto"
                >
                  <v-card-title>
                    Leyte Normal University
                  </v-card-title>
                  <v-subheader class="white--text">
                    Pamantasang Normal ng Leyte
                  </v-subheader>
                </v-img>
                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-rating
                      :value="4.2"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                    />
                    <div class="grey--text ms-4">
                      4.2 (81 reviews)
                    </div>
                  </v-row>
                  <div class="my-4 subtitle-1">
                    Public University
                  </div>
                </v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-card-actions>
                  <v-list dense>
                    <v-row justify="start" align="start">
                      <v-col cols="12" class="pa-2 pt-0 pb-0">
                        <v-list-item>
                          <v-icon color="primary">
                            mdi-google-maps
                          </v-icon>
                          <v-subheader>
                            <a
                              href="https://www.google.com/maps/place/Leyte+Normal+University/@11.2380362,124.9995256,17z/data=!4m9!1m2!2m1!1slnu!3m5!1s0x3308772c87c4c367:0xa5e5c080ec6a88ef!8m2!3d11.2381879!4d125.001328!15sCgNsbnWSARFwdWJsaWNfdW5pdmVyc2l0eQ"
                              color="primary"
                            >
                              Paterno St, Downtown, Tacloban City, 6500 Leyte
                            </a>
                          </v-subheader>
                        </v-list-item>
                      </v-col>
                      <v-col cols="12" class="pa-2 pt-0 pb-0">
                        <v-list-item>
                          <v-icon color="primary">
                            mdi-web
                          </v-icon>
                          <v-subheader>
                            <a href="http://www.lnu.edu.ph/" color="primary">
                              lnu.edu.ph
                            </a>
                          </v-subheader>
                        </v-list-item>
                      </v-col>
                      <v-col cols="12" class="pa-2 pt-0 pb-0">
                        <v-list-item>
                          <v-icon color="primary">
                            mdi-phone
                          </v-icon>
                          <v-subheader>
                            +63538880855
                          </v-subheader>
                        </v-list-item>
                      </v-col>
                    </v-row>
                  </v-list>
                </v-card-actions>
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
