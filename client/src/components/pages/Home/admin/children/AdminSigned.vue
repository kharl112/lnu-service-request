<script>
import { formatDistanceToNow } from "date-fns";
export default {
  name: "AdminSigned",
  data: () => ({
    show: false,
    colors: ["primary", "warning", "error", "success"],
  }),
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
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
      });
    },
    downloadPDF(id) {
      return this.$store.dispatch("pdf/generatePDF", {
        user_type: "admin",
        id,
      });
    },
    getInitials(name) {
      const { firstname, lastname } = name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    getRandomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
  },
  created() {
    return this.$store.dispatch("request/allSigned", "admin");
  },
};
</script>
<template>
  <v-container fluid>
    <v-row dense justify="start">
      <v-col
        cols="12"
        sm="12"
        md="8"
        v-if="getAllSigned[0] && !getLoading.all_signed"
      >
        <v-expansion-panels accordion hover>
          <v-expansion-panel
            outlined
            v-for="signed in getAllSigned"
            :key="signed.name"
          >
            <v-expansion-panel-header>
              <v-list-item-subtitle
                class="pa-0 mr-4 text-caption text-sm-subtitle-1"
              >
                {{ signed.subject }}
              </v-list-item-subtitle>
              <v-card-subtitle
                class="pa-0 mr-4 text-caption text-no-wrap text-right primary--text text-capitalize"
              >
                {{ getTimeOrDate(signed.date) }}
              </v-card-subtitle>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-divider />
              <v-card-subtitle
                class="pa-0 pt-2 pb-2 text-caption text-no-wrap font-weight-bold"
              >
                Type:
                {{ signed.service[0].type }}
                <v-icon color="success" right>
                  mdi-check-circle
                </v-icon>
              </v-card-subtitle>
              <v-divider />
              <v-card-subtitle class="pa-0 pt-2 text-caption">
                From:
                {{ getFullname(signed.user.profile[0].name) }}
              </v-card-subtitle>
              <v-card-subtitle class="pa-0 pb-2 text-caption capitalized">
                {{
                  `${signed.user.department.role[0].name} of ${signed.user.department.unit[0].name}`
                }}
              </v-card-subtitle>
              <v-card-actions class="pa-2">
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
                </v-row>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12" sm="12" md="8" v-else-if="getLoading.all_signed">
        <v-skeleton-loader type="table" />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="8"
        v-else-if="!getAllSigned[0] && !getLoading.all_signed"
      >
        <v-row justify="start">
          <v-col cols="12">
            <v-banner single-line>
              <v-icon slot="icon" color="warning" size="36">
                mdi-exclamation-thick
              </v-icon>
              No signed service request
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
  </v-container>
</template>
