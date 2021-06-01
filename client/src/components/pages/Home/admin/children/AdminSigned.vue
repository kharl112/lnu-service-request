<script>
export default {
  name: "AdminSigned",
  data: () => ({
    show: false,
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
    downloadPDF(id) {
      return this.$store.dispatch("pdf/generatePDF", {
        user_type: "admin",
        id,
      });
    },
    getInitials(name) {
      const { firstname, lastname } = name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    getRandomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
  },
  created() {
    return this.$store.dispatch("request/allSigned", "admin");
  },
};
</script>
<template>
  <v-container fluid class="pa-3">
    <v-row dense justify="start">
      <v-col
        cols="12"
        sm="12"
        md="8"
        v-if="getAllSigned[0] && !getLoading.all_signed"
      >
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr v-for="signed in getAllSigned" :key="signed.name">
                <td class="pt-4 pb-4 text-left">
                  <v-col cols="2">
                    <v-avatar :color="getRandomColor()">
                      <span class="white--text headline">{{
                        getInitials(signed.user.profile[0].name)
                      }}</span>
                    </v-avatar>
                  </v-col>
                </td>
                <td class="text-left mb-1">
                  <v-list-item-title class="pa-0 text-caption font-weight-bold">
                    {{ getFullname(signed.user.profile[0].name) }}
                  </v-list-item-title>
                  <v-spacer />
                  <v-list-item-subtitle
                    class="pa-0 text-caption2 "
                  >
                    {{ signed.subject }}
                  </v-list-item-subtitle>
                </td>
                <td class="text-center">
                  <v-row justify="center" align="center">
                    <v-col cols="12" class="pa-0">
                      <v-card-subtitle
                        class="pa-0 pb-n2 text-center text-caption"
                      >
                        {{ getTimeOrDate(signed.date) }}
                      </v-card-subtitle>
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      <v-btn
                        icon
                        color="error"
                        class="ml-2"
                        large
                        :disabled="getPDFLoading"
                        @click="downloadPDF(signed._id)"
                      >
                        <v-icon dark>
                          mdi-cloud-download
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="12" sm="12" md="8" v-else-if="getLoading.all_signed">
        <v-skeleton-loader type="table" />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="8"
        v-else-if="!getAllSigned[0] && !getLoading.all_signed"
      >
        <v-row justify="start">
          <v-col cols="12">
            <v-banner single-line>
              <v-icon slot="icon" color="warning" size="36">
                mdi-exclamation-thick
              </v-icon>
              No signed service request
            </v-banner>
          </v-col>
        </v-row>
      </v-col>
      <v-divider class="hidden-sm-and-down" vertical />
      <v-col md="4" class="hidden-sm-and-down">
        <v-row>
          <v-col cols="12">
            <v-container fluid>
              <v-card class="mx-auto" max-width="344">
                <v-img
                  src="https://www.windowsphonefr.com/wp-content/uploads/2019/05/ThinkstockPhotos-187625854.jpg"
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
  </v-container>
</template>
