<script>
import QRCodeBox from "./contents/QRCodeBox";
import getTimeLine from "./contents/getTimeLine";
import { formatISO9075 } from "date-fns";

export default {
  name: "TrackRequest",
  components: {
    QRCodeBox,
  },
  data: () => ({
    show: false,
    step: 9,
    timeout: 3000,
  }),
  computed: {
    trackedLoading() {
      return this.$store.getters["request/getLoading"].tracked;
    },
    success() {
      return this.$store.getters["message/getSuccess"];
    },
    error() {
      return this.$store.getters["message/getError"];
    },
    tracked() {
      return this.$store.getters["request/getTracked"];
    },
    fixTimeLine() {
      return getTimeLine(this.$store.getters["request/getTracked"])
        .filter(({ status }) => status)
        .reduce((arr, node) => [node, ...arr], []);
    },

    track_id: {
      get() {
        return this.$route.query.id;
      },
      set(track_id) {
        return this.$router.replace({
          name: "track",
          query: { id: track_id },
        });
      },
    },
  },
  methods: {
    handleSubmit(e) {
      if (e) e.preventDefault();
      if (this.track_id) {
        return this.$store.dispatch("request/Track", this.track_id);
      }
    },
    getDescription(name, description) {
      const { firstname, lastname } = name;
      if (typeof name === "object")
        return `This request was signed by ${firstname} ${lastname} (${this.getDepartment(
          description
        )}).`;
      return name;
    },
    getTimeOrDate(date) {
      if (date)
        return `${formatISO9075(new Date(date), {
          representation: "date",
        })} ${formatISO9075(new Date(date), { representation: "time" })}`;
      else return "";
    },

    tConvert(time) {
      time = time.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) {
        time = time.slice(1);
        time[5] = +time[0] < 12 ? " AM" : " PM";
        time[0] = +time[0] % 12 || 12;
      }

      return time.join("");
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    getDepartment(department) {
      if (typeof department === "string") return department;
      const { unit } = department;
      return `${unit[0].name} Department`;
    },
    showQR() {
      return (this.show = !this.show);
    },
    copyTrackId() {
      var copy_id = document.getElementById("track_id");
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
  },
  created() {
    this.handleSubmit(null);
  },
  destroyed() {
    return this.$store.commit("request/setTracked", {});
  },
};
</script>
<template>
  <div class="container">
    <v-row justify="center" align-items="center" class="row-container">
      <v-col cols="12" sm="8" md="7" align="center">
        <v-card
          outlined
          class="pa-5 pt-7 pb-7 ma-1"
          max-width="600"
          min-width="250"
        >
          <v-row justify="center" align="center">
            <v-col cols="12" class="pa-1 mb-2" align="center">
              <v-row justify="center" align="center">
                <v-icon x-large color="primary" classs="ma-4">
                  mdi-map-marker-distance
                </v-icon>
                <div
                  class="text-caption text-sm-body-1 text-md-h6 primary--text text-center text-sm-left text-md-left pa-5"
                >
                  LNU Service Requesting App
                  <v-card-subtitle class="caption text-sm-body-1 pa-0 pb-1">
                    Request Tracking
                  </v-card-subtitle>
                  <v-divider />
                </div>
              </v-row>
            </v-col>
            <v-col cols="11" class="pt-5 pb-0 mb-n3">
              <v-form @submit="handleSubmit">
                <v-text-field
                  append-icon="mdi-send"
                  prepend-inner-icon="mdi-content-copy"
                  @click:append="handleSubmit"
                  @click:prepend-inner="copyTrackId"
                  :loading="trackedLoading"
                  dense
                  outlined
                  id="track_id"
                  label="Enter your tracking code"
                  v-model="track_id"
                />
              </v-form>
            </v-col>

            <v-col cols="11" class="pt-4" v-if="error">
              <v-alert type="error" class="pt-2 pb-2 text-left">
                <span class="overline text-capitalize">{{ error }}</span>
              </v-alert>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="8"
        md="7"
        align="center"
        v-if="tracked.user && !trackedLoading"
      >
        <v-card
          outlined
          class="pa-5 pt-7 pb-7 ma-1"
          max-width="600"
          min-width="250"
        >
          <v-row justify="center" align="center">
            <v-col cols="11" class="pa-2">
              <v-row justify="center">
                <v-card-title
                  class="text-center font-weight-bold pa-2 overline"
                >
                  Request Status
                </v-card-title>
                <v-btn
                  v-if="!error"
                  icon
                  large
                  color="primary"
                  @click="showQR"
                  title="generate QR Code"
                >
                  <v-icon>mdi-qrcode</v-icon>
                </v-btn>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-timeline align-top dense>
                <v-timeline-item
                  v-for="node in fixTimeLine"
                  :key="node.staff_id"
                  :color="
                    node.reports.date === fixTimeLine[0].reports.date
                      ? 'primary'
                      : 'grey'
                  "
                  :icon="node.status ? 'mdi-check' : 'mdi-dots-horizontal'"
                  small
                  fill-dot
                  class="text-left"
                >
                  <v-container fluid>
                    <v-row justify="space-between">
                      <v-col cols="12" sm="8" class="py-0">
                        <span class="pa-0 caption">
                          {{ getDescription(node.name, node.description) }}
                        </span>
                        <p
                          class="pa-0 caption ma-0 text-capitalize"
                          v-if="node.reports.remarks"
                        >
                          <strong>Remarks:</strong> {{ node.reports.remarks }}
                        </p>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        class="py-2 py-md-0 text-left text-sm-right"
                      >
                        <small v-if="node.reports.date">
                          {{ getTimeOrDate(node.reports.date).split(" ")[0] }}
                        </small>
                        <p class="pa-0 caption" v-if="node.reports.date">
                          {{
                            tConvert(
                              getTimeOrDate(node.reports.date).split(" ")[1]
                            )
                          }}
                        </p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-timeline-item>
              </v-timeline>
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="11">
              <v-row justify="start">
                <v-simple-table class="table">
                  <thead>
                    <tr>
                      <th class="text-left text-caption font-weight-bold">
                        Service Type
                      </th>
                      <th class="text-left text-caption font-weight-bold">
                        Requestor
                      </th>
                      <th class="text-left text-caption font-weight-bold">
                        Service Provider
                      </th>
                      <th class="text-left text-caption font-weight-bold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {{ tracked.service[0].type }}
                      </td>
                      <td>
                        <span>
                          {{ getFullname(tracked.user.profile[0].name) }}
                        </span>
                      </td>
                      <td>
                        <span v-if="tracked.service_provider.staff_id">
                          {{
                            getFullname(
                              tracked.service_provider.profile[0].name
                            )
                          }}
                        </span>
                        <span class="font-weight-bold danger--text" v-else
                          >NA</span
                        >
                      </td>
                      <td>
                        <span class="font-weight-bold text-uppercase">
                          {{ tracked.reports.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" md="7" align="center" v-else-if="trackedLoading">
        <v-card min-width="250" max-width="600" outlined>
          <v-skeleton-loader
            type="card-heading, card-heading, article, article"
          />
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="8"
        md="7"
        align="center"
        v-else-if="!tracked.user && !trackedLoading"
      >
        <v-img
          src="../../../assets/images/track_progress.png"
          class="img-placeholder"
        />
        <p class="body-1 pa-0">
          Track your request using <strong>QR Code</strong> or type the
          <strong>Tracking Code. </strong>
        </p>
      </v-col>
      <v-col cols="12" sm="8" md="7" align="center">
        <v-card
          outlined
          class="pa-5 pt-7 pb-7 ma-1"
          max-width="600"
          min-width="250"
        >
          <v-row justify="center" align="center">
            <v-col cols="12" class="pa-0">
              <v-card-subtitle class="pa-0 font-weight-bold overline">
                Quick Links
              </v-card-subtitle>
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="11">
              <v-row justify="space-around">
                <router-link
                  to="/"
                  class="text-overline ma-2 font-weight-bold"
                >
                  Home
                </router-link>
                <router-link
                  to="/login"
                  class="text-overline ma-2 font-weight-bold"
                >
                  Login
                </router-link>
                <router-link
                  to="/help/about"
                  class="text-overline ma-2 font-weight-bold"
                >
                  About
                </router-link>
                <router-link
                  to="/help/tutorials"
                  class="text-overline ma-2 font-weight-bold"
                >
                  Tutorials
                </router-link>
                <router-link
                  to="/help/privacy-and-policy"
                  class="text-overline ma-2 font-weight-bold"
                >
                  Privacy
                </router-link>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <QRCodeBox :showQR="showQR" :show="show" />
    </v-row>
  </div>
</template>
<style scoped>
.row-container {
  height: 95vh;
  overflow-y: auto;
}
.table {
  width: 100%;
}

.img-placeholder {
  max-width: 300px;
}
</style>
