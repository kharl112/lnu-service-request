<script>
import { formatDistanceToNow } from "date-fns";
export default {
  name: "Drafts",
  data: () => ({ show: false }),
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
      });
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
    getFlag(service_request) {
      const { admin, head } = service_request;
      return head.signature && admin.signature
        ? "success"
        : head.signature || admin.signature
        ? "primary"
        : "error";
    },
  },
  created() {
    return this.$store.dispatch("request/allSend");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12" sm="12" md="8" class="pa-0">
        <v-container fluid class="pa-2">
          <v-col cols="12">
            <v-row>
              <v-chip
                small
                color="error"
                class="text-caption text-uppercase font-weight-bold ma-2"
              >
                unsigned
              </v-chip>
              <v-chip
                small
                color="primary"
                class="text-caption  text-uppercase font-weight-bold ma-2"
              >
                signed
              </v-chip>
              <v-chip
                small
                color="success"
                class="text-caption  text-uppercase font-weight-bold ma-2"
              >
                fully-signed
              </v-chip>
            </v-row>
          </v-col>
          <v-divider />
        </v-container>
        <v-container fluid v-if="getAllSend[0] && !getLoading.all_send">
          <v-row justify="start" justify-sm="start" align="start">
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-for="send in getAllSend"
              :key="send._id"
            >
              <v-card class="mx-auto pb-2">
                <v-list-item three-line>
                  <v-list-item-content class="pb-0">
                    <div class="caption text-uppercase mb-4">
                      {{ getTimeOrDate(send.date) }}
                      <v-badge
                        class="pl-2"
                        offset-y="-5"
                        offset-x="5"
                        dot
                        :color="getFlag(send)"
                      />
                    </div>
                    <v-list-item-title class="subtitle mb-1">
                      {{ send.subject }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="subtitle-2 mb-2">
                      {{ send.body }}
                    </v-list-item-subtitle>
                    <v-divider class="mb-2 mt-2" />
                    <div>
                      <v-chip outlined :color="getFlag(send)" small>
                        <span class="caption font-weight-bold">
                          {{ send.service[0].type }}
                        </span>
                      </v-chip>
                    </div>
                    <v-divider class="mb-2 mt-2" />
                  </v-list-item-content>
                </v-list-item>

                <v-card-actions class="pa-2">
                  <v-container class="pa-0">
                    <v-btn
                      block
                      rounded
                      small
                      :color="getFlag(send)"
                      :disabled="getPDFLoading"
                      @click="downloadPDF(send._id)"
                    >
                      Download PDF
                      <v-icon right dark>
                        mdi-cloud-download
                      </v-icon>
                    </v-btn>
                  </v-container>
                </v-card-actions>
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
                You have empty sent requests
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
