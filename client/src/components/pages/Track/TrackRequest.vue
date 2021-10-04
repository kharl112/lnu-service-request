<script>
import QRCodeBox from "./contents/QRCodeBox";
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
    getTrackLoading() {
      return this.$store.getters["request/getLoading"].tracked_request;
    },
    getSuccess() {
      return this.$store.getters["message/getSuccess"];
    },
    getError() {
      return this.$store.getters["message/getError"];
    },
    getTrackedRequest() {
      return this.$store.getters["request/getTrackedRequest"];
    },
    snackbar: {
      get() {
        return this.$store.getters["message/getSnackbar"];
      },
      set(flag) {
        return this.$store.commit("message/setSnackbar", flag);
      },
    },
    track_id: {
      get() {
        return this.$route.params._id;
      },
      set(track_id) {
        return track_id
          ? track_id !== this.$route.params._id
            ? this.$router.replace({
                name: "track",
                params: { _id: track_id },
              })
            : null
          : null;
      },
    },
  },
  methods: {
    handleSubmit(e) {
      if (e) e.preventDefault();
      if (this.track_id) {
        return this.$store.dispatch("request/trackRequest", this.track_id);
      }
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    getSignatures(service_request) {
      const { admin, service_provider, user } = service_request;
      if (service_provider.staff_id) return [user, admin, service_provider];
      return [user, admin];
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
    if (this.track_id !== "none") {
      return this.handleSubmit(null);
    }
  },
  destroyed() {
    return this.$store.commit("request/setTrackedRequest", {});
  },
};
</script>
<template>
  <div class="container">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="7" align="center">
        <v-card
          outlined
          class="pa-5 pt-7 pb-7 ma-1"
          max-width="500"
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
                  <span class="font-weight-bold warning--text mr-1">LNU</span>
                  Service Request System
                  <v-card-subtitle class="caption text-sm-body-1 pa-0 pb-1">
                    Track Request
                  </v-card-subtitle>
                  <v-divider />
                </div>
              </v-row>
            </v-col>
            <v-col cols="11" class="pt-0 pb-0 mb-n3">
              <v-form @submit="handleSubmit">
                <v-text-field
                  append-icon="mdi-send"
                  prepend-inner-icon="mdi-content-copy"
                  @click:append="handleSubmit"
                  @click:prepend-inner="copyTrackId"
                  :loading="getTrackLoading"
                  dense
                  outlined
                  id="track_id"
                  label="track id"
                  v-model="track_id"
                />
              </v-form>
            </v-col>

            <v-col cols="11" class="pt-4" v-if="getError">
              <v-alert type="error" class="pt-1 pb-1 text-left">
                <span class="caption">{{ getError }}</span>
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
        v-if="getTrackedRequest.user && !getTrackLoading"
      >
        <v-card
          outlined
          class="pa-5 pt-7 pb-7 ma-1"
          max-width="500"
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
                  v-if="!getError"
                  icon
                  large
                  color="primary"
                  @click="showQR"
                >
                  <v-icon>mdi-qrcode</v-icon>
                </v-btn>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-stepper v-model="step" vertical outlined>
                <v-stepper-step
                  v-for="(signee, index) in getSignatures(getTrackedRequest)"
                  :key="signee._id"
                  :complete="signee.signature"
                  :step="index + 1"
                >
                  {{ getFullname(signee.profile[0].name) }}
                  <small>
                    {{
                      signee.department
                        ? signee.department.unit[0].name
                        : "Chief Admin Office"
                    }}
                  </small>
                </v-stepper-step>

                <v-stepper-step
                  :complete="getTrackedRequest.status >= 1"
                  color="success"
                  complete-icon="mdi-hammer-wrench"
                  :step="getTrackedRequest.service_provider.staff_id ? 4 : 3"
                >
                  Rendered
                  <small>
                    Service providers or the requesters marked the request as
                    completed
                  </small>
                </v-stepper-step>
                <v-stepper-step
                  :complete="getTrackedRequest.status === 2"
                  color="warning"
                  complete-icon="mdi-archive"
                  :step="getTrackedRequest.service_provider.staff_id ? 5 : 4"
                >
                  Archived
                  <small>
                    Requesters already archived this request
                  </small>
                </v-stepper-step>
              </v-stepper>
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="11">
              <v-row justify="start">
                <v-card-text class="body-2 text-uppercase pa-0 text-left">
                  Service type:
                  <span class="text-decoration-underline">
                    {{ getTrackedRequest.service[0].type }}
                  </span>
                </v-card-text>
                <v-card-text class="body-2 text-uppercase pa-0 text-left">
                  Status:
                  <span class="font-weight-bold">{{
                    getTrackedRequest.status === 0
                      ? "Pending"
                      : getTrackedRequest.status === 1
                      ? "Completed"
                      : "Archived"
                  }}</span>
                </v-card-text>
                <v-card-text class="body-2 text-uppercase pa-0 pt-4 text-left">
                  Requested By:
                  <span class="font-weight-bold">{{
                    getFullname(getTrackedRequest.user.profile[0].name)
                  }}</span>
                </v-card-text>
                <v-card-text class="body-2 text-uppercase pa-0 text-left">
                  Rendered By:
                  <span
                    class="font-weight-bold"
                    v-if="getTrackedRequest.service_provider.staff_id"
                    >{{
                      getFullname(
                        getTrackedRequest.service_provider.profile[0].name
                      )
                    }}</span
                  >
                  <span class="font-weight-bold" v-else>NA</span>
                </v-card-text>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" md="7" align="center" v-else-if="getTrackLoading">
        <v-skeleton-loader
          type="card-heading, card-heading, article"
          max-width="500"
          min-width="250"
        />
      </v-col>
      <v-col cols="12" sm="8" md="7" align="center">
        <v-card
          outlined
          class="pa-5 pt-7 pb-7 ma-1"
          max-width="500"
          min-width="250"
        >
          <v-row justify="center" align="center">
            <v-col cols="12" class="pa-0">
              <v-card-subtitle class="pa-0 font-weight-bold">
                Quick Links
              </v-card-subtitle>
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="11">
              <v-row justify="center">
                <router-link to="/" class="caption primary--text ma-2">
                  <v-icon color="primary">mdi-home</v-icon>
                  Home
                </router-link>

                <router-link
                  to="/admin/login"
                  class="caption primary--text ma-2"
                >
                  <v-icon color="primary">mdi-account</v-icon>
                  Chief Admin Office
                </router-link>

                <router-link
                  to="/faculty/login"
                  class="caption primary--text ma-2 text-center"
                >
                  <v-icon color="primary">mdi-account-supervisor</v-icon>
                  Employee & Service Provider
                </router-link>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <QRCodeBox :showQR="showQR" :show="show" />
      <v-snackbar
        :timeout="timeout"
        v-show="getSuccess"
        color="success"
        v-model="snackbar"
      >
        {{ getSuccess }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>

      <v-snackbar
        :timeout="timeout"
        v-show="getError"
        color="error"
        v-model="snackbar"
      >
        {{ getError }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </div>
</template>
