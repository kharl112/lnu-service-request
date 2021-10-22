<script>
import { formatDistanceToNow } from "date-fns";
import PreviewRequest from "../contents/PreviewRequest";
import UploadFile from "../contents/UploadFile";
import tableOptions from "./tableOptions";

export default {
  name: "FacultySigned",
  components: {
    PreviewRequest,
    UploadFile,
  },
  data: () => ({
    show: false,
    uploadVisibility: false,
    preview: { show: false, data: null },
    table: tableOptions,
    selected: "",
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
        includeSeconds: true,
        addSuffix: true,
      });
    },
    showPreview(request = null) {
      return (this.preview = { show: !this.preview.show, data: request });
    },
    markAsCompleted(request_id) {
      this.selected = request_id;
      return this.$store.dispatch("request/markRequest", {
        request_id,
        type: "complete",
        user_type: "provider",
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
    showUpload() {
      this.uploadVisibility = this.uploadVisibility ? false : true;
    },
  },
  created() {
    return this.$store.dispatch("request/allSigned", "provider");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12">
        <v-container fluid class="pr-0 pb-0 pt-0">
          <v-row justify="space-between" align="start" class="pa-4">
            <v-col cols="12" sm="6" md="4">
              <span class="h4 warning--text font-weight-bold">
                Signed Requests
              </span>
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
        <v-container fluid v-if="getAllSigned[0] && !getLoading.all_signed">
          <v-data-table
            @click:row="
              (item) => $router.push(`/faculty/home/view/provider/${item._id}`)
            "
            :headers="table.headers"
            :items="getAllSigned"
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
                You have empty signed requests
              </v-banner>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <PreviewRequest
      v-if="preview.show"
      :downloadPDF="downloadPDF"
      :showPreview="showPreview"
      :showUpload="showUpload"
      :preview="preview"
      :markAsCompleted="markAsCompleted"
      :user_type="'provider'"
    />
    <UploadFile
      :uploadVisibility="uploadVisibility"
      :request_obj="preview.data"
      :showUpload="showUpload"
    />
  </v-container>
</template>
