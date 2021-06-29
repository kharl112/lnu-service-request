<script>
import { formatDistanceToNow } from "date-fns";
export default {
  name: "Sent",
  data: () => ({
    show: false,
    filter: [
      { text: "All", value: "all" },
      { text: "Pending", value: "pending" },
      { text: "Completed", value: "completed" },
    ],
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
    gotoCreate() {
      return this.$router.push(`/faculty/home/compose`);
    },
    downloadPDF(id) {
      return this.$store.dispatch("pdf/generatePDF", {
        user_type: "faculty",
        id,
      });
    },
    isSigned(service_request) {
      const { admin, service_provider } = service_request;
      if (service_provider.staff_id)
        return !!admin.signature && !!service_provider.signature;
      return !!admin.signature;
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    getSignatures(service_request) {
      const { admin, service_provider } = service_request;
      if (service_provider.staff_id) return [admin, service_provider];
      return [admin];
    },
    copyTrackId(index) {
      var copy_id = document.getElementById(`track_id${index}`);
      copy_id.select();
      copy_id.setSelectionRange(0, 99999);
      try {
        document.execCommand("copy");
        return this.$store.dispatch(
          "message/successMessage",
          "copied to clipboard"
        );
      } catch (error) {
        return this.$store.dispatch(
          "message/errorMessage",
          "something went wrong"
        );
      }
    },
    handleFilter(filter) {
      return this.$store.dispatch("request/allSend", {
        filter,
        type: "faculty",
      });
    },
    markAsArchive(request_id) {
      return this.$store.dispatch("request/markRequest", {
        request_id,
        type: "archive",
        user_type: "faculty",
      });
    },
    markAsCompleted(request_id) {
      return this.$store.dispatch("request/markRequest", {
        request_id,
        type: "complete",
        user_type: "faculty",
      });
    },
  },
  created() {
    this.$store.dispatch("request/allSend", { filter: "all", type: "faculty" });
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12" sm="12" md="8" class="pa-0">
        <v-container fluid class="pa-0">
          <v-col cols="12" sm="5" md="4" class="pt-0 pb-0">
            <v-select
              outlined
              class="mb-n5"
              label="Filter"
              value="all"
              @change="handleFilter"
              prepend-inner-icon="mdi-filter"
              :items="filter"
              item-text="text"
              item-value="value"
            />
          </v-col>
          <v-divider />
        </v-container>
        <v-container fluid v-if="getAllSend[0] && !getLoading.all_send">
          <v-row justify="start" justify-sm="start" align="start">
            <v-col
              cols="12"
              sm="6"
              md="6"
              v-for="(send, index) in getAllSend"
              :key="send._id"
            >
              <v-card class="mx-auto pa-1">
                <v-list-item three-line>
                  <v-list-item-content class="pb-0">
                    <div class="caption text-capitalize font-weight-bold mb-4">
                      {{ getTimeOrDate(send.date) }}
                      <v-chip
                        x-small
                        class="caption pr-1 pl-1 ml-1"
                        :color="send.status === 0 ? 'primary' : 'success'"
                      >
                        {{ send.status === 0 ? "pending" : "completed" }}
                      </v-chip>
                    </div>
                    <v-list-item-title class="text-subtitle-1 mb-1">
                      {{ send.subject }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="caption  mb-1">
                      Service type:
                      <span
                        :class="
                          `font-weight-bold text-uppercase ${
                            send.status === 0 ? 'primary' : 'success'
                          }--text`
                        "
                        >{{ send.service[0].type }}</span
                      >
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-card-actions class="pa-4 pt-2 pb-2">
                  <v-container class="pa-0">
                    <v-card-text class="pa-0 caption font-weight-bold">
                      <v-text-field
                        readonly
                        dense
                        outlined
                        small
                        label="Track ID"
                        append-icon="mdi-content-copy"
                        :id="`track_id${index}`"
                        :value="send._id"
                        @click:append="copyTrackId(index)"
                        class="font-weight-regular caption mb-n6"
                      />
                    </v-card-text>
                  </v-container>
                </v-card-actions>
                <v-expansion-panels accordion flat>
                  <v-expansion-panel>
                    <v-expansion-panel-header class="pa-1 pl-4">
                      <div>
                        <v-btn
                          class="pa-0 pl-1 pr-1 font-weight-bold"
                          small
                          :color="send.status === 0 ? 'primary' : 'success'"
                          elevation="0"
                          @click="$router.push(`/track/${send._id}`)"
                        >
                          Track Request
                        </v-btn>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="pa-0">
                      <v-card-text class="pa-0">
                        <v-card-actions>
                          <v-row>
                            <v-btn
                              block
                              elevation="0"
                              class="mt-2 mb-1"
                              color="primary"
                              :disabled="getPDFLoading"
                              @click="downloadPDF(send._id)"
                            >
                              Download PDF
                              <v-icon right dark>
                                mdi-cloud-download
                              </v-icon>
                            </v-btn>
                            <v-btn
                              v-if="send.status === 1"
                              block
                              elevation="0"
                              class="mt-2 mb-1"
                              color="warning"
                              :disabled="getLoading.mark"
                              @click="markAsArchive(send._id)"
                            >
                              Archive
                              <v-icon right dark>
                                mdi-archive
                              </v-icon>
                            </v-btn>
                            <v-btn
                              v-if="
                                send.status === 0 &&
                                  !send.service_provider.staff_id &&
                                  send.admin.signature
                              "
                              block
                              elevation="0"
                              class="mt-2 mb-1"
                              color="success"
                              :disabled="getLoading.mark"
                              @click="markAsCompleted(send._id)"
                            >
                              Mark as completed
                              <v-icon right>
                                mdi-check-circle
                              </v-icon>
                            </v-btn>
                          </v-row>
                        </v-card-actions>
                      </v-card-text>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
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
                No service requests found
                <template v-slot:actions>
                  <v-btn color="primary" @click="gotoCreate" text>
                    create
                  </v-btn>
                </template>
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
