<script>
import { formatDistanceToNow } from "date-fns";
import PreviewRequest from "../contents/PreviewRequest";
export default {
  name: "AdminArchives",
  components: { PreviewRequest },
  data: () => ({
    show: false,
    preview: false,
    selected: null,
    table: {
      headers: [
        {
          text: "From",
          align: "left",
          sortable: false,
          value: "user.profile[0].name.lastname",
        },
        {
          text: "Service Provider",
          align: "left",
          sortable: false,
          value: "service_provider.profile[0]",
        },
        {
          text: "Service type",
          align: "left",
          sortable: false,
          value: "service[0].type",
        },
        {
          text: "Date Created",
          align: "left",
          sortable: true,
          value: "date",
        },
      ],
    },
  }),
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getAllArchives() {
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
    getSignatures(service_request) {
      const { admin, service_provider } = service_request;
      return [admin, service_provider];
    },
    showPreview(request = null) {
      return (this.preview = { show: !this.preview.show, data: request });
    },
  },
  created() {
    this.$store.dispatch("request/allSend", {
      filter: "archived",
      type: "admin",
    });
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12" sm="12" md="8" class="pa-0">
        <v-container fluid v-if="getAllArchives[0] && !getLoading.all_send">
          <v-data-table
            @click:row="(item) => showPreview(item)"
            :headers="table.headers"
            :items="getAllArchives"
            class="elevation-0"
          >
            <template v-slot:item.date="{ item }">
              <v-chip small color="primary" class="text-center text-caption">
                {{ getTimeOrDate(item.date) }}
              </v-chip>
            </template>
            <template v-slot:item.service_provider.profile[0]="{ item }">
              <div v-if="item.service_provider.staff_id">
                <span>
                  {{ item.service_provider.profile[0].name.lastname }}
                </span>
                <v-spacer />
                <span class="caption">
                  {{ item.service_provider.department.unit[0].name }}
                </span>
              </div>
              <span v-else class="error--text font-weight-bold"> NA </span>
            </template>
          </v-data-table>
        </v-container>
        <v-container fluid v-else-if="getLoading.all_send">
          <v-skeleton-loader type="table" />
        </v-container>
        <v-container
          fluid
          v-else-if="!getAllArchives[0] && !getLoading.all_send"
        >
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
        <v-container
          fluid
          v-else-if="!getAllArchives[0] && !getLoading.all_send"
        >
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
                  src="https://anlantawan.files.wordpress.com/2020/08/ellenyu.jpg?w=720"
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
    <PreviewRequest
      v-if="preview.show"
      :downloadPDF="downloadPDF"
      :showPreview="showPreview"
      :preview="preview"
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
