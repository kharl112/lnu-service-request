<script>
export default {
  name: "Drafts",
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getError() {
      return this.$store.getters["request/getError"];
    },
    getAllSend() {
      return this.$store.getters["request/getAllSend"];
    },
  },
  methods: {
    getTimeOrDate(date) {
      const now = new Date();
      const created = new Date(date);
      const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEPT",
        "OCT",
        "NOV",
        "DEC",
      ];
      const day = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
      return now.getFullYear() >= created.getFullYear()
        ? now.getMonth() <= created.getMonth()
          ? now.getDate() <= created.getDate()
            ? now.getHours() <= created.getHours()
              ? now.getMinutes() <= created.getMinutes()
                ? now.getSeconds() <= created.getSeconds()
                  ? ""
                  : `${now.Seconds() - created.Seconds()} sec ago`
                : `${now.getMinutes() - created.getMinutes()} min ago`
              : `${now.getHours() - created.getHours()} hr ago`
            : `Last ${day[created.getDay()]}`
          : `Last ${months[created.getMonth()]}`
        : `Last year${created.getFullYear()}`;
    },
    gotoCreate() {
      return this.$router.push(`/faculty/home/compose`);
    },
  },
  created() {
    return this.$store.dispatch("request/allSend");
  },
};
</script>
<template>
  <v-container fluid class="pa-0">
    <v-row dense justify="start">
      <v-col cols="12" sm="12" md="7" class="pl-7 pl-sm-0 pl-md-12 pl-lg-0">
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
                  <v-list-item-content>
                    <div class="overline mb-4">
                      {{ getTimeOrDate(send.date) }}
                    </div>
                    <v-list-item-title class="headline mb-1">
                      {{ send.subject }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ send.body }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-card-actions>
                  <v-btn
                    color="error"
                    class="ma-2 white--text hidden-md-and-down"
                  >
                    Download PDF
                    <v-icon right dark>
                      mdi-cloud-download
                    </v-icon>
                  </v-btn>
                  <v-btn
                    class="mx-2 hidden-lg-and-up"
                    elevation="0"
                    fab
                    dark
                    small
                    color="error"
                  >
                    <v-icon dark>
                      mdi-cloud-download
                    </v-icon>
                  </v-btn>
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
                    make one
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
              <v-card outlined>
                <v-img
                  src="https://www.webmedia.com.ph/sites/default/files/Drupal-Training-Basic-Advance-Leyte-Normal-University-LNU-Tacloban-Leyte-10.jpg"
                  height="200px"
                ></v-img>
                <v-card-subtitle clas="blue--text">
                  Leyte Normal University Requesting Guidlines
                </v-card-subtitle>
                <v-divider />
                <v-list-item>
                  1. Be polite
                </v-list-item>
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
