<script>
export default {
  name: "SideNav",
  props: {
    showLogout: Function,
  },
  data: () => ({
    dialog: false,
    items: [
      {
        title: "Pending",
        icon: "mdi-email-alert",
        getter: "Pendings",
        path: "/admin/home/pending",
        tag: "For Approval",
      },
      {
        title: "Signed",
        icon: "mdi-email-edit",
        getter: "Signed",
        path: "/admin/home/signed",
        tag: "",
      },
      {
        title: "Archives",
        icon: "mdi-archive",
        getter: "Archives",
        path: "/admin/home/archives",
        tag: "",
      },
      {
        title: "Track",
        icon: "mdi-map-marker-distance",
        path: "/track",
        tag: "",
      },
    ],
  }),
  computed: {
    adminProfile() {
      return this.$store.getters["admin/getProfile"];
    },
    getAdminFullName() {
      const { firstname, lastname, middle_initial, prefix, suffixes } =
        this.adminProfile.name;
      return `${
        prefix ? prefix + "." : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${
        suffixes[0] ? suffixes.toString() : ""
      }`;
    },
    getAdminInitials() {
      const { firstname, lastname } = this.adminProfile.name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
    route: {
      get() {
        return this.$route.fullPath;
      },
      set(path) {
        if (path)
          if (this.$route.fullPath !== path) return this.$router.push(path);
        return;
      },
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
            <span class="white--text headline">{{ getAdminInitials }}</span>
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ getAdminFullName }}</v-list-item-title>
          <v-list-item-subtitle>{{
            this.adminProfile.email
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list dense>
      <v-subheader class="font-weight-bold">Received Requests</v-subheader>
      <v-list-item-group v-model="route" color="grey">
        <v-list-item v-for="(child, i) in items" :key="i" :value="child.path">
          <v-list-item-icon>
            <v-icon v-text="child.icon" />
          </v-list-item-icon>
          <v-list-item-content :title="getTitleDescription(child)">
            <v-list-item-title v-text="child.title" />
          </v-list-item-content>
          <v-badge
            offset-x="15"
            color="primary"
            v-if="child.title === 'Pending'"
            :content="getLength(child.getter)"
            :title="getTitleDescription(child)"
          />
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-divider />

    <v-list dense>
      <v-subheader class="font-weight-bold">My Account</v-subheader>
      <v-list-item-group color="grey" v-model="route">
        <v-list-item value="/admin/home/settings" title="Sign-out your account">
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
