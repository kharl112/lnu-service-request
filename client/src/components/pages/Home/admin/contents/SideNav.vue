<script>
export default {
  name: "SideNav",
  props: {
    showLogout: Function,
  },
  data: () => ({
    mini: true,
    dialog: false,
    items: [
      { title: "Signed", icon: "mdi-email-edit" },
      { title: "Pending", icon: "mdi-email-alert" },
      { title: "Tokens", icon: "mdi-checkbox-multiple-blank-circle" },
      { title: "Faculty", icon: "mdi-account-alert" },
    ],
  }),
  computed: {
    getAdminProfile() {
      return this.$store.getters["admin/getProfile"];
    },
    getAdminFullName() {
      const {
        firstname,
        lastname,
        middle_initial,
        prefix,
        suffixes,
      } = this.getAdminProfile.name;
      return `${
        prefix ? prefix + "." : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${
        suffixes[0] ? JSON.stringify(...suffixes) : ""
      }`;
    },
    getAdminInitials() {
      const { firstname, lastname } = this.getAdminProfile.name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
    route: {
      get() {
        return this.$route.fullPath.split("/")[3];
      },
      set(link) {
        if (link)
          if (this.$route.fullPath !== `/admin/home/${link}`)
            return this.$router.push(`/admin/home/${link}`);
        return;
      },
    },
    navigation: {
      get() {
        return this.$store.getters["navigation/getDrawer"];
      },
      set(drawer) {
        return this.$store.commit("navigation/setDrawer", drawer);
      },
    },
  },
};
</script>
<template>
  <v-navigation-drawer
    fixed
    permanent
    v-model="navigation"
    :mini-variant.sync="mini"
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
            this.getAdminProfile.email
          }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list dense>
      <v-subheader v-show="!mini">Requests</v-subheader>
      <v-list-item-group v-model="route" color="warning">
        <v-list-item
          v-for="(child, i) in items"
          :key="i"
          :value="child.title.toLowerCase()"
        >
          <v-list-item-icon>
            <v-icon v-text="child.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="child.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-divider />

    <v-list dense>
      <v-subheader v-show="!mini">Account</v-subheader>
      <v-list-item-group color="warning" v-model="route">
        <v-list-item value="settings">
          <v-list-item-icon>
            <v-icon>mdi-account-settings</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-list-item @click="showLogout" link>
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
