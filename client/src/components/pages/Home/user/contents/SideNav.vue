<script>
export default {
  name: "SideNav",
  props: {
    showLogout: Function,
  },
  data: () => ({
    dialog: false,
    request_items: [
      {
        title: "Sent",
        icon: "mdi-send-check",
        getter: "Send",
      },
      {
        title: "Drafts",
        icon: "mdi-email-edit",
        getter: "Draft",
      },
      { title: "Archives", icon: "mdi-archive" },
    ],
    received_items: [
      {
        title: "Pending",
        icon: "mdi-email-receive",
        getter: "Pending",
      },
      {
        title: "Signed",
        icon: "mdi-signature-freehand",
        getter: "Signed",
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
        suffixes[0] ? suffixes.toString() : ""
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
      <v-subheader>Requests</v-subheader>
      <v-list-item-group color="primary" v-model="route">
        <v-list-item
          v-for="(child, i) in request_items"
          :key="i"
          :value="child.title.toLowerCase()"
        >
          <v-list-item-icon>
            <v-icon v-text="child.icon" />
            <v-badge
              v-if="
                child.getter &&
                  $store.getters[`request/getAll${child.getter}`].length
              "
              color="primary"
              dot
            />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="child.title" />
          </v-list-item-content>
          <v-badge
            v-if="
              child.getter &&
                $store.getters[`request/getAll${child.getter}`].length
            "
            color="primary"
            :content="$store.getters[`request/getAll${child.getter}`].length"
            offset-x="10"
            offset-y="7"
          />
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-list dense>
      <v-subheader>Received</v-subheader>
      <v-list-item-group color="primary" v-model="route">
        <v-list-item
          v-for="(child, i) in received_items"
          :key="i"
          :value="child.title.toLowerCase()"
        >
          <v-list-item-icon>
            <v-icon v-text="child.icon" />
            <v-badge
              v-if="$store.getters[`request/getAll${child.getter}`].length"
              color="primary"
              dot
            />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="child.title" />
          </v-list-item-content>
          <v-badge
            v-if="$store.getters[`request/getAll${child.getter}`].length"
            color="primary"
            :content="$store.getters[`request/getAll${child.getter}`].length"
            offset-x="10"
            offset-y="7"
          />
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-list dense>
      <v-subheader>Account</v-subheader>
      <v-list-item-group color="primary" v-model="route">
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
          <v-icon color="warning">mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="warning--text">Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped></style>
