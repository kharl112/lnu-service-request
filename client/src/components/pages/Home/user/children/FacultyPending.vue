<script>
import SetSignature from "../contents/SetSignature";
import PreviewRequest from "../contents/preview/PreviewRequest";
import { formatDistanceToNow } from "date-fns";
export default {
  name: "FacultyPending",
  components: {
    SetSignature,
    PreviewRequest,
  },
  data: () => ({
    signatureVisibility: false,
    preview: { show: false, data: null },
    selected: "",
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
    showPreview(request = null) {
      return (this.preview = { show: !this.preview.show, data: request });
    },
    handleSetSignature(signatureId) {
      const signature = document
        .getElementById(signatureId)
        .innerHTML.toString()
        .replace('height="300"', 'height="175" viewBox="0 0 300 175"');

      return this.$store.dispatch("request/signRequest", {
        request_id: this.selectedRequest,
        signature,
        type: "provider",
      });
    },
    downloadPDF(id) {
      this.selected = id;
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
  },
  created() {
    return this.$store.dispatch("request/allPending", "provider");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start" v-if="!getProfileLoading">
      <v-col cols="12">
        <v-container fluid class="pr-0 pb-0 pt-0">
          <v-col cols="8" sm="5" md="4">
            <span class="h4 warning--text font-weight-bold">
              Pending Requests
            </span>
          </v-col>
          <v-divider />
        </v-container>
        <v-container fluid v-if="getAllPending[0] && !getLoading.all_pending">
          <v-simple-table fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Description
                  </th>
                  <th class="text-center">
                    Type
                  </th>
                  <th class="text-center">
                    Created
                  </th>
                  <th class="text-center">
                    Status
                  </th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pending in getAllPending" :key="pending.name">
                  <td>
                    <v-list-item-subtitle
                      @click="showPreview(pending)"
                      class="pa-0 text-caption text-left text-sm-body-2 text-lowercase"
                    >
                      {{ pending.subject }}
                    </v-list-item-subtitle>
                  </td>
                  <td class="text-center">
                    <v-list-item-subtitle
                      @click="showPreview(pending)"
                      class="pa-0 text-caption text-sm-body-2 text-lowercase"
                    >
                      {{ pending.service[0].type }}
                    </v-list-item-subtitle>
                  </td>
                  <td class="text-center" @click="showPreview(pending)">
                    <v-chip
                      small
                      color="primary"
                      class="pa-0 pr-2 pl-2 text-center text-caption"
                    >
                      {{ getTimeOrDate(pending.date) }}
                    </v-chip>
                  </td>
                  <td class="text-center" @click="showPreview(pending)">
                    <small
                      :class="
                        `pa-0 text-caption font-weight-bold ${
                          pending.status === 0
                            ? 'primary--text'
                            : 'success--text'
                        }`
                      "
                    >
                      {{ pending.status === 0 ? "Pending" : "Completed" }}
                    </small>
                  </td>
                  <td class="text-center text-no-wrap">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          class="mt-2 mb-1"
                          color="error"
                          :loading="getPDFLoading && selected === pending._id"
                          @click="downloadPDF(pending._id)"
                        >
                          <v-icon>
                            mdi-cloud-download
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Download</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          class="mt-2 mb-1"
                          color="success"
                          @click="showSignature(pending._id)"
                        >
                          <v-icon>
                            mdi-signature-freehand
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Sign request</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          class="mt-2 mb-1"
                          color="primary"
                          @click="$router.push(`/track/${pending._id}`)"
                        >
                          <v-icon>
                            mdi-map-marker-distance
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Track Request</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
        <v-container fluid v-else-if="getLoading.all_pending">
          <v-skeleton-loader type="table" />
        </v-container>
        <v-container
          fluid
          v-else-if="!getAllPending[0] && !getLoading.all_pending"
        >
          <v-row justify="start">
            <v-col cols="12">
              <v-banner single-line>
                <v-icon slot="icon" color="warning" size="36">
                  mdi-exclamation-thick
                </v-icon>
                You have empty unsigned requests
              </v-banner>
            </v-col>
          </v-row>
        </v-container>
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
    <PreviewRequest
      :downloadPDF="downloadPDF"
      :showPreview="showPreview"
      :preview="preview"
    />
  </v-container>
</template>
