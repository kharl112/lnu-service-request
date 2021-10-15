<script>
import SetSignature from "../contents/SetSignature";
import UploadFile from "../contents/UploadFile";
import PreviewRequest from "../contents/PreviewRequest";
import { formatDistanceToNow } from "date-fns";
import tableOptions from "./tableOptions";

export default {
  name: "AdminPending",
  components: {
    SetSignature,
    PreviewRequest,
    UploadFile,
  },
  data: () => ({
    signatureVisibility: false,
    uploadVisibility: false,
    preview: { show: false, data: null },
    table: tableOptions,
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
        type: "admin",
      });
    },
    downloadPDF(id) {
      this.selected = id;
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
    showUpload() {
      this.uploadVisibility = this.uploadVisibility ? false : true;
    },
  },
  created() {
    return this.$store.dispatch("request/allPending", "admin");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start" v-if="!getProfileLoading">
      <v-col cols="12">
        <v-container fluid>
          <v-row justify="space-between" align="start" class="pa-4">
            <v-col cols="12" sm="6" md="4">
              <span class="h4 primary--text"> Pending Requests </span>
            </v-col>
            <v-col cols="12" sm="6" md="7">
              <v-text-field
                v-model="table.search"
                append-icon="mdi-magnify"
                label="Search"
                dense
                single-line
                hide-details
              />
            </v-col>
          </v-row>
          <v-divider />
        </v-container>
        <v-container fluid v-if="getAllPending[0] && !getLoading.all_pending">
          <v-data-table
            @click:row="(item) => showPreview(item)"
            :headers="table.headers"
            :items="getAllPending"
            :search="table.search"
            class="elevation-0"
          >
            <template v-slot:item.date="{ item }">
              <v-chip
                small
                color="primary"
                class="pa-0 pr-2 pl-2 text-center text-caption"
              >
                {{ getTimeOrDate(item.date) }}
              </v-chip>
            </template>
            <template v-slot:item.status="{ item }">
              <small
                :class="
                  `${item.status === 0 ? 'primary--text' : 'success--text'}`
                "
              >
                {{ item.status === 0 ? "Pending" : "Completed" }}
              </small>
            </template>
          </v-data-table>
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
    <PreviewRequest
      v-if="preview.show"
      :downloadPDF="downloadPDF"
      :showPreview="showPreview"
      :showUpload="showUpload"
      :preview="preview"
      :showSignature="showSignature"
    />
    <SetSignature
      :signatureVisibility="signatureVisibility"
      :showSignature="showSignature"
      :handleSetSignature="handleSetSignature"
    />
    <UploadFile
      :uploadVisibility="uploadVisibility"
      :request_obj="preview.data"
      :showUpload="showUpload"
    />
  </v-container>
</template>
