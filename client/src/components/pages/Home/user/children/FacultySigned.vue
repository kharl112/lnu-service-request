<script>
import { formatDistanceToNow } from "date-fns";
export default {
  name: "FacultySigned",
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getProfileLoading() {
      return this.$store.getters["faculty/getLoading"].profile;
    },
    getAllSigned() {
      return this.$store.getters["request/getAllSigned"];
    },
    getPDFLoading() {
      return this.$store.getters["pdf/getLoading"];
    },
  },
  methods: {
    getTimeOrDate(date) {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        includeSeconds: true,
      }).replace("about ", "");
    },
    downloadPDF(id) {
      return this.$store.dispatch("pdf/generatePDF", {
        user_type: "provider",
        id,
      });
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },

    markAsCompleted(request_id) {
      return this.$store.dispatch("request/markRequest", {
        request_id,
        type: "complete",
        user_type: "provider",
      });
    },
  },
  created() {
    return this.$store.dispatch("request/allSigned", "provider");
  },
};
</script>
<template>
  <v-container fluid class="pa-1 pa-sm-3">
    <v-row dense justify="start" v-if="!getProfileLoading">
      <v-col cols="12" sm="12" md="8">
        <v-container fluid v-if="getAllSigned[0] && !getLoading.all_signed">
          <v-expansion-panels outlined hover>
            <v-expansion-panel
              v-for="signed in getAllSigned"
              :key="signed.name"
            >
              <v-expansion-panel-header>
                <v-container fluid class="pa-2 ">
                  <v-row>
                    <v-list-item-subtitle class="text-body-1">
                      {{ signed.subject }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="text-caption">
                      {{ signed.service[0].type }} &#8211;
                      <span class="font-italic caption">
                        {{
                          `${signed.user.profile[0].name.firstname} ${signed.user.profile[0].name.lastname}`
                        }}
                      </span>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="text-caption hidden-md-and-up">
                      <span class="primary--text caption">
                        {{ getTimeOrDate(signed.date) }}
                      </span>
                    </v-list-item-subtitle>
                  </v-row>
                </v-container>
                <div align="right" class="hidden-sm-and-down">
                  <v-chip
                    small
                    class="ma-2 pl-2 pr-2 text-center caption"
                    color="primary"
                  >
                    {{ getTimeOrDate(signed.date) }}
                  </v-chip>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-divider class="mb-1 mt-1 hidden-md-and-up" />
                <v-container class="hidden-md-and-up">
                  <v-row
                    justify="space-between"
                    align="start"
                    align-sm="center"
                  >
                    <v-card-subtitle class="pa-0 pt-sm-2 pb-sm-2 text-body-2">
                      Subject:
                      {{ signed.subject }}
                      <br />
                      <span class="text-caption">
                        Type:
                        {{ signed.service[0].type }}
                      </span>
                      <v-chip
                        x-small
                        class="pt-1 pb-1 caption ml-1"
                        :color="signed.status === 0 ? 'primary' : 'success'"
                      >
                        {{ signed.status === 0 ? "pending" : "completed" }}
                      </v-chip>
                    </v-card-subtitle>
                  </v-row>
                </v-container>
                <v-divider class="mb-1 mt-1" />
                <v-card-subtitle class="pa-0 pt-2 text-caption">
                  From:
                  {{ getFullname(signed.user.profile[0].name) }}
                </v-card-subtitle>
                <v-card-subtitle
                  class="pa-0 pb-2 text-caption text-decoration-underline"
                >
                  {{
                    `${signed.user.department.role[0].name} of ${signed.user.department.unit[0].name}`
                  }}
                </v-card-subtitle>
                <v-card-subtitle class="pa-0 pt-2 text-caption">
                  To:
                  {{ getFullname(signed.admin.profile[0].name) }}
                </v-card-subtitle>
                <v-card-subtitle
                  class="pa-0 pb-2 text-caption text-decoration-underline"
                >
                  {{ `Chief Administration Office` }}
                </v-card-subtitle>
                <v-card-actions class="pa-2">
                  <v-row justify="start" align="center">
                    <v-col
                      cols="12"
                      sm="4"
                      md="3"
                      align="start"
                      class="pa-2 pl-0"
                    >
                      <v-btn
                        small
                        block
                        min-width="50px"
                        color="error"
                        :disabled="getPDFLoading"
                        @click="downloadPDF(signed._id)"
                      >
                        Download
                        <v-icon right>
                          mdi-cloud-download
                        </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="4"
                      md="3"
                      align="start"
                      class="pa-2 pl-0"
                    >
                      <v-btn
                        v-if="signed.status === 0"
                        small
                        block
                        min-width="50px"
                        color="primary"
                        :disabled="getLoading.mark"
                        @click="markAsCompleted(signed._id)"
                      >
                        Mark as completed
                        <v-icon right>
                          mdi-check-circle
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
        <v-container fluid v-else-if="getLoading.all_signed">
          <v-skeleton-loader type="table" />
        </v-container>
        <v-container
          fluid
          v-else-if="!getAllSigned[0] && !getLoading.all_signed"
        >
          <v-row justify="start">
            <v-col cols="12">
              <v-banner single-line>
                <v-icon slot="icon" color="warning" size="36">
                  mdi-exclamation-thick
                </v-icon>
                No signed request
              </v-banner>
            </v-col>
          </v-row>
        </v-container>
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
        <v-progress-circular
          :size="50"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>
