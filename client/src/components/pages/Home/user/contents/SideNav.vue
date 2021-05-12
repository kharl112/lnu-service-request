<script>
export default {
  name: "SideNav",
  props: {
    showLogout: Function,
  },
  data: () => ({
    drawer: true,
    mini: true,
    selected: 1,
    dialog: false,
    items: [
      { title: "Sent", icon: "mdi-send-check" },
      { title: "Drafts", icon: "mdi-email-edit" },
      { title: "Received", icon: "mdi-email-receive" },
    ],
  }),
  methods: {
    handleLinks(link) {
      return this.$router.replace(`/faculty/home/${link}`);
    },
  },
  computed: {
    getFacultyProfile() {
      return this.$store.getters["faculty/getProfile"];
    },
    getFacultyFullName() {
      const {
        firstname,
        lastname,
        middle_initial,
        prefix,
        suffixes,
      } = this.getFacultyProfile.name;
      return `${prefix}. ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${JSON.stringify(
        ...suffixes
      )}`;
    },
    getFacultyInitials() {
      const { firstname, lastname } = this.getFacultyProfile.name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
  },
};
</script>
<template>
  <v-navigation-drawer
    floating
    permanent
    v-model="drawer"
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
      <v-list-item link>
        <v-list-item-icon>
          <v-icon color="primary">mdi-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Compose</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />

    <v-list dense>
      <v-subheader>Requests</v-subheader>
      <v-list-item-group v-model="selected" color="primary">
        <v-list-item
          v-for="(child, i) in items"
          :key="i"
          @click="handleLinks(child.title.toLowerCase())"
        >
          <v-list-item-icon>
            <v-icon v-text="child.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="child.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>

      <v-subheader>Account</v-subheader>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-account-settings</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link @click="showLogout">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped></style>