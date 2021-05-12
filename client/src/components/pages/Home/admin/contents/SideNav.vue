<script>
export default {
  name: "SideNav",
  props: {
    showLogout: Function,
  },
  data: () => ({
    drawer: true,
    mini: true,
    selected: 2,
    dialog: false,
    items: [
      { title: "Signed", icon: "mdi-email-edit" },
      { title: "Pending", icon: "mdi-email-alert" },
      { title: "Tokens", icon: "mdi-checkbox-multiple-blank-circle" },
    ],
  }),
  methods: {
    handleLinks(link) {
      return this.$router.replace(`/admin/home/${link}`);
    },
  },
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
      return `${prefix}. ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${JSON.stringify(
        ...suffixes
      )}`;
    },
    getAdminInitials() {
      const { firstname, lastname } = this.getAdminProfile.name;
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
