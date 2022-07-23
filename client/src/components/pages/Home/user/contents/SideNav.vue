<script>
export default {
  name: "SideNav",
  props: {
    showLogout: Function,
  },
  data: () => ({
    dialog: false,
    home: [
      {
        title: "Dashboard",
        icon: "mdi-tablet-dashboard",
        getter: "",
        path: "/faculty/home/dashboard",
        tag: "",
      },
      {
        title: "Activity Log",
        icon: "mdi-cogs",
        getter: "",
        path: "/faculty/home/activity-log",
        tag: "",
      },
    ],
    request_items: [
      {
        title: "Drafts",
        icon: "mdi-email-edit",
        getter: "Drafts",
        path: "/faculty/home/drafts",
        tag: "",
      },
      {
        title: "Sent",
        icon: "mdi-send-check",
        getter: "Sent",
        path: "/faculty/home/sent",
        tag: "",
      },
      {
        title: "Archives",
        icon: "mdi-archive",
        getter: "Archives",
        path: "/faculty/home/archives",
        tag: "",
      },
      {
        title: "Track",
        icon: "mdi-map-marker-distance",
        path: "/track",
        tag: "",
      },
    ],
    received_items: [
      {
        title: "Pending",
        icon: "mdi-email-multiple",
        getter: "Pendings",
        path: "/faculty/home/pending",
        tag: "For Approval",
      },
      {
        title: "Signed",
        icon: "mdi-signature-freehand",
        getter: "Signed",
        path: "/faculty/home/signed",
        tag: "",
      },
    ],
  }),
  computed: {
    getFacultyProfile() {
      return this.$store.getters["faculty/getProfile"];
    },
    isMobile() {
      const mobile = window.matchMedia("(max-width: 780px)");
      return mobile.matches;
    },
    drawer: {
      get() {
        return this.$store.getters["navigation/getDrawer"];
      },
      set(bool) {
        return this.$store.commit("navigation/setDrawer", bool);
      },
    },
    getFacultyFullName() {
      const { firstname, lastname, middle_initial, prefix, suffixes } =
        this.getFacultyProfile.name;
      return `${
        prefix ? prefix + "." : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${
        suffixes[0] ? suffixes.toString() : ""
      }`;
    },
    getFacultyInitials() {
      const { firstname, lastname } = this.getFacultyProfile.name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
    route: {
      get() {
        return this.$route.fullPath;
      },
      set(link) {
        if (link)
          if (this.$route.fullPath !== link) return this.$router.push(link);
        return;
      },
    },
  },
  methods: {
    getLength(getter) {
      if (!getter) return 0;
      return this.$store.getters[`request/get${getter}`].length;
    },
    getTitleDescription(child) {
      if (child.title === "Track") return "Track Requests";
      return (
        "You have " +
        this.getLength(child.getter) +
        " " +
        child.title +
        " Requests " +
        child.tag
      );
    },
  },
  destroyed() {
    this.drawer = false;
  },
};
</script>
<template>
  <v-navigation-drawer
    :permanent="!isMobile"
    :absolute="isMobile"
    :temporary="isMobile"
    v-model="drawer"
    height="100vh"
  >
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-avatar color="primary" size="40">
            <span class="white--text headline">{{ getFacultyInitials }}</span>
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ getFacultyFullName }}</v-list-item-title>
          <v-list-item-subtitle>{{
            getFacultyProfile.email
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list shaped>
      <v-list-item-group v-model="route">
        <v-list-item
          value="/faculty/home/compose"
          title="Create, Draft and Send Service Request"
        >
          <v-list-item-icon>
            <v-icon color="primary">mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Create Request</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-divider />
    <v-list dense>
      <v-subheader class="font-weight-bold">Home</v-subheader>
      <v-list-item-group color="grey" v-model="route">
        <v-list-item v-for="(child, i) in home" :key="i" :value="child.path">
          <v-list-item-icon>
            <v-icon v-text="child.icon" />
          </v-list-item-icon>
          <v-list-item-content :title="getTitleDescription(child)">
            <v-list-item-title v-text="child.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-list dense>
      <v-subheader class="font-weight-bold">My Requests</v-subheader>
      <v-list-item-group color="grey" v-model="route">
        <v-list-item
          v-for="(child, i) in request_items"
          :key="i"
          :value="child.path"
        >
          <v-list-item-icon>
            <v-icon v-text="child.icon" />
          </v-list-item-icon>
          <v-list-item-content :title="getTitleDescription(child)">
            <v-list-item-title v-text="child.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-list dense>
      <v-subheader class="font-weight-bold">Received Requests</v-subheader>
      <v-list-item-group color="grey" v-model="route">
        <v-list-item
          v-for="(child, i) in received_items"
          :key="i"
          :value="child.path"
        >
          <v-list-item-icon>
            <v-icon v-text="child.icon" />
          </v-list-item-icon>
          <v-list-item-content :title="getTitleDescription(child)">
            <v-list-item-title v-text="child.title" />
          </v-list-item-content>
          <v-badge
            v-if="child.title === 'Pending'"
            offset-x="15"
            color="primary"
            :content="getLength(child.getter) || '0'"
            :title="getTitleDescription(child)"
          />
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-list dense>
      <v-subheader class="font-weight-bold">My Account</v-subheader>
      <v-list-item-group color="grey" v-model="route">
        <v-list-item value="/faculty/home/settings" title="Go to settings">
          <v-list-item-icon>
            <v-icon>mdi-account-settings</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-list-item @click="showLogout" link title="Sign-out your account">
        <v-list-item-icon>
          <v-icon color="primary">mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="primary--text">Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped></style>
