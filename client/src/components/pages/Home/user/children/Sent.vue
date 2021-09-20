<script>
import { formatDistanceToNow } from "date-fns";
import PreviewRequest from "../contents/PreviewRequest";
export default {
  name: "Sent",
  components: {
    PreviewRequest,
  },
  data: () => ({
    show: false,
    preview: { show: false, data: null },
    selected: "",
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
    showPreview(request = null) {
      return (this.preview = { show: !this.preview.show, data: request });
    },
    gotoCreate() {
      return this.$router.push(`/faculty/home/compose`);
    },
    downloadPDF(id) {
      this.selected = id;
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
      if (service_provider.staff_id) return [admin, service_provider];
      return [admin];
    },
    handleFilter(filter) {
      return this.$store.dispatch("request/allSend", {
        filter,
        type: "faculty",
      });
    },
    markAsArchive(request_id) {
      this.selected = request_id;
      return this.$store.dispatch("request/markRequest", {
        request_id,
        type: "archive",
        user_type: "faculty",
      });
    },
    markAsCompleted(request_id) {
      this.selected = request_id;
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
      <v-col cols="12" class="pa-0">
        <v-container fluid class="pa-0">
          <v-col cols="8" sm="5" md="4" class="pt-0 pb-2">
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
              dense
            />
          </v-col>
          <v-divider />
        </v-container>
        <v-container fluid v-if="getAllSend[0] && !getLoading.all_send">
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
                <tr v-for="send in getAllSend" :key="send.name">
                  <td @click="showPreview(send)">
                    <v-list-item-subtitle
                      class="pa-0 text-caption text-left text-sm-body-2 text-lowercase"
                    >
                      {{ send.subject }}
                    </v-list-item-subtitle>
                  </td>
                  <td class="text-center" @click="showPreview(send)">
                    <v-list-item-subtitle
                      class="pa-0 text-caption text-sm-body-2 text-lowercase"
                    >
                      {{ send.service[0].type }}
                    </v-list-item-subtitle>
                  </td>
                  <td class="text-center" @click="showPreview(send)">
                    <v-chip
                      small
                      color="primary"
                      class="pa-0 pr-2 pl-2 text-center text-caption"
                    >
                      {{ getTimeOrDate(send.date) }}
                    </v-chip>
                  </td>
                  <td class="text-center" @click="showPreview(send)">
                    <small
                      :class="
                        `pa-0 text-caption font-weight-bold ${
                          send.status === 0 ? 'primary--text' : 'success--text'
                        }`
                      "
                    >
                      {{ send.status === 0 ? "Pending" : "Completed" }}
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
                          color="primary"
                          :disabled="getLoading.mark"
                          @click="$router.push(`/track/${send._id}`)"
                        >
                          <v-icon>
                            mdi-map-marker-distance
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Track request</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
        <v-container fluid v-else-if="getLoading.all_send">
          <v-skeleton-loader type="table" />
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
    </v-row>
    <PreviewRequest
      v-if="preview.show"
      :downloadPDF="downloadPDF"
      :showPreview="showPreview"
      :preview="preview"
      :markAsArchive="markAsArchive"
      :markAsCompleted="markAsCompleted"
    />
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
