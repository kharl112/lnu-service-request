<script>
import SideNav from "./contents/SideNav";
import Header from "./contents/Header";
import ConfirmLogout from "./contents/ConfirmLogout";
import { formatDistanceToNow } from "date-fns";

export default {
  name: "HomeUser",
  components: {
    SideNav,
    ConfirmLogout,
    Header,
  },
  data: () => ({
    logout: false,
    timeout: 2000,
  }),
  computed: {
    getSuccess() {
      return this.$store.getters["message/getSuccess"];
    },
    getError() {
      return this.$store.getters["message/getError"];
    },
    getNotif() {
      return this.$store.getters["message/getNotification"];
    },
    snackbar: {
      get() {
        return this.$store.getters["message/getSnackbar"];
      },
      set(flag) {
        return this.$store.commit("message/setSnackbar", flag);
      },
    },
    notif_bar: {
      get() {
        return this.$store.getters["message/getNotifBar"];
      },
      set(flag) {
        return this.$store.commit("message/setNotifBar", flag);
      },
    },
  },
  methods: {
    showLogout() {
      return (this.logout = !this.logout);
    },
    viewRequest(request_id, user_type = "user") {
      this.notif_bar = false;
      const path = `/faculty/home/view/${user_type}/${request_id}`;
      this.$router.push(path);
    },
    getUserInitials(name) {
      const { firstname, lastname } = name;
      return firstname.toUpperCase()[0] + lastname.toUpperCase()[0];
    },
    getFullname(name) {
      const { firstname, lastname, prefix } = name;
      return `${prefix ? `${prefix}.` : ""} ${firstname} ${lastname} `;
    },
    getTimeOrDate(date) {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        includeSeconds: true,
      }).replace("about ", "");
    },
    getColorByUserType(user_type = "faculty") {
      return user_type === "provider" ? "warning" : "primary";
    },
  },
  mounted() {
    const profile = this.$store.getters["faculty/getProfile"];
    if (profile) {
      const channel = this.$pusher.subscribe(profile.staff_id);

      channel.bind("received", (options) => {
        this.$store.dispatch("message/detachNotif");
        this.$store.dispatch("message/notify", options);
        this.$store.dispatch("request/Pendings", "provider");
        this.$store.dispatch("notification/notifications", {
          user_type: "faculty",
          filter: null,
        });
      });

      channel.bind("rejected", (options) => {
        this.$store.dispatch("message/detachNotif");
        this.$store.dispatch("message/notify", options);
        this.$store.dispatch("request/Pendings", "provider");
        this.$store.dispatch("notification/notifications", {
          user_type: "faculty",
          filter: null,
        });
      });

      channel.bind("signed", (options) => {
        this.$store.dispatch("message/detachNotif");
        this.$store.dispatch("message/notify", options);
        this.$store.dispatch("notification/notifications", {
          user_type: "faculty",
          filter: null,
        });
      });
    }
  },
};
</script>
<template>
  <v-container fluid class="home-container">
    <v-row no-gutters dense class="home-row1">
      <SideNav :showLogout="showLogout" />
      <v-col class="home-col1">
        <v-container fluid class="home-container2">
          <v-row
            justify="end"
            justify-sm="center"
            justify-md="center"
            align="start"
          >
            <v-col cols="12">
              <Header />
            </v-col>
            <v-col cols="12">
              <transition name="slide-right" mode="out-in">
                <router-view></router-view>
              </transition>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <ConfirmLogout :logout="logout" :showLogout="showLogout" />
    <v-snackbar
      :timeout="timeout"
      v-show="getSuccess"
      color="success"
      v-model="snackbar"
      class="text-capitalize"
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
      class="text-capitalize"
    >
      {{ getError }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-if="getNotif"
      v-show="getNotif"
      right
      tile
      v-model="notif_bar"
      :timeout="10000"
    >
      <v-container fluid fill-height>
        <v-row justify="start" align="center">
          <v-avatar :color="getColorByUserType(getNotif.user_type)" size="40">
            {{ getUserInitials(getNotif.initiator) }}
          </v-avatar>
          <span class="ml-2 body-2">
            <strong>
              {{ getFullname(getNotif.initiator) }}
            </strong>
            {{ getNotif.message }}
            <p class="pa-0 ma-0 caption">
              {{ getTimeOrDate(getNotif.date) }}
            </p>
          </span>
        </v-row>
      </v-container>
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          color="primary"
          @click="viewRequest(getNotif.request_id, getNotif.user_type)"
          class="ma-2"
        >
          View
        </v-btn>
        <v-btn
          text
          v-bind="attrs"
          color="light"
          @click="notif_bar = false"
          class="ma-2"
        >
          Dismiss
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style lang="scss" scoped>
@import "../../../../assets/scss/pages/Home/home.scss";
</style>
