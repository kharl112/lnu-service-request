<script>
import { formatDistanceToNow } from "date-fns";
export default {
  name: "AdminArchives",
  data: () => ({
    show: false,
    table: {
      headers: [
        {
          text: "Requestor",
          align: "left",
          sortable: true,
          value: "user.profile",
        },
        {
          text: "Service Provider",
          align: "left",
          sortable: true,
          value: "service_provider.profile[0]",
        },
        {
          text: "Service Type",
          align: "left",
          sortable: true,
          value: "service[0].type",
        },
        {
          text: "Date Archived",
          align: "left",
          sortable: true,
          value: "reports.dates.archived",
        },
      ],
    },
  }),
  computed: {
    loading() {
      return this.$store.getters["request/getLoading"];
    },
    archives() {
      return this.$store.getters["request/getArchives"];
    },
  },
  methods: {
    getTimeOrDate(date) {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        includeSeconds: true,
      }).replace("about ", "");
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
    this.$store.dispatch("request/Archives", "admin");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12" sm="12" md="9" class="pa-0">
        <v-container fluid v-if="archives[0] && !loading.archives">
          <v-data-table
            @click:row="(item) => $router.push(`/admin/home/view/${item._id}`)"
            :headers="table.headers"
            :items="archives"
            :items-per-page="5"
            class="elevation-0 data-table"
          >
            <template v-slot:[`item.user.profile`]="{ item }">
              {{ getFullname(item.user.profile[0].name) }}
              <v-spacer />
              <span class="caption">
                {{ item.user.department.unit[0].name }}
              </span>
            </template>
            <template v-slot:[`item.reports.dates.archived`]="{ item }">
              <v-chip small color="primary" class="text-center text-caption">
                {{ getTimeOrDate(item.reports.dates.archived) }}
              </v-chip>
            </template>
            <template v-slot:[`item.service_provider.profile[0]`]="{ item }">
              <div v-if="item.service_provider.staff_id">
                <span>
                  {{ getFullname(item.service_provider.profile[0].name) }}
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
        <v-container fluid v-else-if="loading.archives">
          <v-skeleton-loader type="table" />
        </v-container>
        <v-container fluid v-else-if="!archives[0] && !loading.archives">
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
      <v-col md="3" class="hidden-sm-and-down">
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
                  <v-card-title> Requesting Services in LNU </v-card-title>
                </v-img>

                <v-card-actions>
                  <v-btn color="warning" text> Contact Us </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="show = !show">
                    <v-icon>
                      {{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}
                    </v-icon>
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
.data-table {
  cursor: pointer;
}
</style>
