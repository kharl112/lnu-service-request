<script>
import QRCode from "qrcode";
export default {
  name: "TrackRequest",
  computed: {
    getTrackLoading() {
      return this.$store.getters["request/getLoading"].tracked_request;
    },
    getError() {
      return this.$store.getters["message/getError"];
    },
    getTrackedRequest() {
      return this.$store.getters["request/getTrackedRequest"];
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
      e.preventDefault();
      if (this.track_id)
        return this.$store.dispatch("request/trackRequest", this.track_id);
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
    generateQR(text) {
      QRCode.toDataURL(
        text,
        {
          type: "image/jpeg",
          quality: 1,
          margin: 1,
          color: {
            dark: "#1976d2",
            light: "#fcaa43",
          },
        },
        (err, url) => {
          if (err) throw err;
          const image = document.getElementById("qr_image");
          image.src = url;
        }
      );
    },
  },
  created() {
    if (this.track_id !== "none") {
      return this.$store.dispatch("request/trackRequest", this.track_id);
    }
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
                  append-icon="mdi-arrow-right-bold-box"
                  @click:append="handleSubmit"
                  :loading="getTrackLoading"
                  dense
                  outlined
                  label="track id"
                  v-model="track_id"
                />
              </v-form>
            </v-col>
            <v-col cols="11" class="pa-1 pl-6" v-if="track_id !== 'none'">
              <v-row justify="start">
                <v-btn elevation="0" small color="primary">
                  get QR code
                  <v-icon right>mdi-qrcode</v-icon>
                </v-btn>
              </v-row>
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
            <v-col cols="11" class="pa-0">
              <v-row justify="center">
                <v-card-title
                  class="text-center pa-2 font-weight-bold caption text-md-body-1"
                >
                  Request Status
                </v-card-title>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-timeline class="pa-0">
                <v-timeline-item
                  v-for="signee in getSignatures(getTrackedRequest)"
                  :key="signee.profile[0].staff_id"
                  :icon="signee.signature ? 'mdi-check' : 'mdi-dots-horizontal'"
                  :color="signee.signature ? 'success' : 'primary'"
                  small
                >
                  <template v-slot:opposite>
                    <small class="caption">{{
                      getFullname(signee.profile[0].name)
                    }}</small>
                  </template>
                  <v-card
                    elevation="2"
                    :color="signee.signature ? 'success' : 'primary'"
                    class="pa-2"
                  >
                    <v-spacer />
                    <small
                      class="pa-0 font-weight-bold caption white--text  text-left"
                    >
                      {{
                        signee.department
                          ? signee.department.unit[0].name
                          : "Chief Admin Office"
                      }}
                    </small>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="11">
              <v-row justify="start">
                <v-card-text class="caption pa-0 green--text text-left">
                  Service type:
                  <span class="font-weight-bold">{{
                    getTrackedRequest.service[0].type
                  }}</span>
                </v-card-text>
                <v-card-text
                  :class="
                    `caption pa-0 text-left ${
                      getTrackedRequest.status === 0 ? 'primary' : 'success'
                    }--text`
                  "
                >
                  Status:
                  <span class="font-weight-bold">{{
                    getTrackedRequest.status === 0
                      ? "Pending"
                      : getTrackedRequest.status === 1
                      ? "Completed"
                      : "Archived"
                  }}</span>
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
                  Faculty & Personnel
                </router-link>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
