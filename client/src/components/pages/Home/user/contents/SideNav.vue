<script>
export default {
  name: "SideNav",
  props: {
    showLogout: Function,
  },
  data: () => ({
    mini: true,
    dialog: false,
    request_items: [
      { title: "Sent", icon: "mdi-send-check" },
      { title: "Drafts", icon: "mdi-email-edit" },
    ],
    received_items: [
      { title: "Pending", icon: "mdi-email-receive" },
      { title: "Signed", icon: "mdi-signature-freehand" },
    ],
  }),
  computed: {
    getFacultyProfile() {
      return this.$store.getters["faculty/getProfile"];
    },
    isHead() {
      return this.getFacultyProfile.department.unit_role !== 1;
    },
    getFacultyFullName() {
      const {
        firstname,
        lastname,
        middle_initial,
        prefix,
        suffixes,
      } = this.getFacultyProfile.name;
      return `${
        prefix ? prefix + "." : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${
        suffixes[0] ? JSON.stringify(...suffixes) : ""
      }`;
    },
    getFacultyInitials() {
      const { firstname, lastname } = this.getFacultyProfile.name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
    route: {
      get() {
        return this.$route.fullPath.split("/")[3];
      },
      set(link) {
        if (link)
          if (this.$route.fullPath !== `/faculty/home/${link}`)
            return this.$router.push(`/faculty/home/${link}`);
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
    disable-route-watcher
    v-model="navigation"
    :mini-variant.sync="mini"
  >
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-avatar color="#e78a00" size="40">
            <span class="white--text headline">{{ getFacultyInitials }}</span>
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ getFacultyFullName }}</v-list-item-title>
          <v-list-item-subtitle>{{
            getFacultyProfile.email
          }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>

    <v-list shaped>
      <v-list-item-group v-model="route">
        <v-list-item value="compose">
          <v-list-item-icon>
            <v-icon color="primary">mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Compose</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-divider />

    <v-list dense>
      <v-subheader v-show="!mini">Requests</v-subheader>
      <v-list-item-group color="primary" v-model="route">
        <v-list-item
          v-for="(child, i) in request_items"
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

    <v-list dense v-if="isHead">
      <v-subheader v-show="!mini">Received</v-subheader>
      <v-list-item-group color="primary" v-model="route">
        <v-list-item
          v-for="(child, i) in received_items"
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

    <v-list dense>
      <v-subheader v-show="!mini">Account</v-subheader>
      <v-list-item-group color="primary" v-model="route">
        <v-list-item value="settings">
          <v-list-item-icon>
            <v-icon>mdi-account-settings</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          @click="showLogout"
          :value="route"
        >
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped></style>
