<script>
import { formatDistanceToNow } from "date-fns";
export default {
  name: "FacultyArchives",
  data: () => ({
    show: false,
  }),
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getAllSend() {
      return this.$store.getters["request/getAllSend"];
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
        user_type: "faculty",
        id,
      });
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    getSignatures(service_request) {
      const { admin, service_provider } = service_request;
      return [admin, service_provider];
    },
  },
  created() {
    this.$store.dispatch("request/allSend", {
      filter: "archived",
      type: "faculty",
    });
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12" sm="12" md="8" class="pa-0">
        <v-container fluid v-if="getAllSend[0] && !getLoading.all_send">
          <v-row justify="start" justify-sm="start" align="start">
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-for="send in getAllSend"
              :key="send._id"
            >
              <v-card class="mx-auto">
                <v-list-item three-line>
                  <v-list-item-content class="pb-0">
                    <div class="caption text-capitalize font-weight-bold mb-4">
                      {{ getTimeOrDate(send.date) }}
                      <v-icon color="warning" class="ml-2">mdi-archive</v-icon>
                    </div>
                    <v-list-item-title class="text-subtitle-1 mb-1">
                      {{ send.subject }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-subtitle-2 mb-2">
                      {{ send.body }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-card-actions class="pa-4 pt-2 pb-3">
                  <v-spacer />
                  <v-container class="pa-0">
                    <v-chip
                      class="font-weight-bold caption pt-2 pb-2 mr-2"
                      x-small
                      color="warning"
                    >
                      {{ send.service[0].type }}
                    </v-chip>
                  </v-container>
                </v-card-actions>
                <v-divider />
                <v-container fluid class="pa-2">
                  <v-btn
                    block
                    color="error"
                    :disabled="getPDFLoading"
                    @click="downloadPDF(send._id)"
                  >
                    Download PDF
                    <v-icon right dark>
                      mdi-cloud-download
                    </v-icon>
                  </v-btn>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid v-else-if="getLoading.all_send">
          <v-row justify="start">
            <v-col cols="12" sm="5" md="4">
              <v-skeleton-loader type="card" />
            </v-col>
            <v-col cols="12" sm="5" md="4">
              <v-skeleton-loader type="card" />
            </v-col>
            <v-col cols="12" sm="5" md="4">
              <v-skeleton-loader type="card" />
            </v-col>
            <v-col cols="12" sm="5" md="4">
              <v-skeleton-loader type="card" />
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid v-else-if="!getAllSend[0] && !getLoading.all_send">
          <v-row justify="start">
            <v-col cols="12">
              <v-banner single-line>
                <v-icon slot="icon" color="warning" size="36">
                  mdi-exclamation-thick
                </v-icon>
                No archived requests found
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
<style scoped lang="scss">
.expansion-panel {
  padding: 0;
}
#main-container {
  padding: 0px;
  margin: 0px;
  padding-left: 45px;
}
@media (max-width: 600px) {
  #main-container {
    padding-left: 25px;
  }
}
</style>
