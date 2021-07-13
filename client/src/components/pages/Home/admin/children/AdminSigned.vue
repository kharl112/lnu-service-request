<script>
import { formatDistanceToNow } from "date-fns";
import shortenUuid from "shorten-uuid";
import PreviewRequest from "../contents/PreviewRequest";
export default {
  name: "AdminSigned",
  components: {
    PreviewRequest,
  },
  data: () => ({
    show: false,
    preview: { show: false, data: null },
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
    trackRequest(id) {
      const characters =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const { encode } = shortenUuid(characters);
      const encoded = encode(id)
        .split("")
        .splice(0, 18)
        .join("");
      return this.$router.push(`/track/${encoded}`);
    },
    showPreview(request = null) {
      return (this.preview = { show: !this.preview.show, data: request });
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
  },
  created() {
    return this.$store.dispatch("request/allSigned", "admin");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12">
        <v-container fluid class="pr-0 pb-0 pt-0">
          <v-col cols="8" sm="5" md="4">
            <span class="h4 primary--text"> Signed Requests </span>
          </v-col>
          <v-divider />
        </v-container>
        <v-container fluid v-if="getAllSigned[0] && !getLoading.all_signed">
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
                <tr v-for="signed in getAllSigned" :key="signed.name">
                  <td>
                    <v-list-item-subtitle
                      @click="showPreview(signed)"
                      class="pa-0 text-caption text-left text-sm-body-2 text-lowercase"
                    >
                      {{ signed.subject }}
                    </v-list-item-subtitle>
                  </td>
                  <td class="text-center">
                    <v-list-item-subtitle
                      @click="showPreview(signed)"
                      class="pa-0 text-caption text-sm-body-2 text-lowercase"
                    >
                      {{ signed.service[0].type }}
                    </v-list-item-subtitle>
                  </td>
                  <td class="text-center" @click="showPreview(signed)">
                    <v-chip
                      small
                      color="primary"
                      class="pa-0 pr-2 pl-2 text-center text-caption"
                    >
                      {{ getTimeOrDate(signed.date) }}
                    </v-chip>
                  </td>
                  <td class="text-center" @click="showPreview(signed)">
                    <small
                      :class="
                        `pa-0 text-caption font-weight-bold ${
                          signed.status === 0
                            ? 'primary--text'
                            : 'success--text'
                        }`
                      "
                    >
                      {{ signed.status === 0 ? "Pending" : "Completed" }}
                    </small>
                  </td>
                  <td class="text-center text-no-wrap">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          large
                          v-bind="attrs"
                          v-on="on"
                          class="mt-2 mb-1"
                          color="error"
                          :loading="getPDFLoading && selected === signed._id"
                          @click="downloadPDF(signed._id)"
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
                          large
                          v-bind="attrs"
                          v-on="on"
                          class="mt-2 mb-1"
                          color="primary"
                          @click="trackRequest(signed._id)"
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
      :downloadPDF="downloadPDF"
      :showPreview="showPreview"
      :preview="preview"
    />
  </v-container>
</template>
