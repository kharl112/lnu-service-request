<script>
export default {
  name: "SideNav",
  data: () => ({
    drawer: true,
    mini: true,
    selected: 1,
    items: [
      { title: "Sent", icon: "mdi-send-check" },
      { title: "Drafts", icon: "mdi-email-edit" },
      { title: "Received", icon: "mdi-email-receive" },
    ],
  }),
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
      <v-list-item class="px-2"
        ><v-list-item-avatar>
          <v-avatar color="#e78a00" size="40">
            <span class="white--text headline">KY</span>
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Kharl Yumul MIT</v-list-item-title>
          <v-list-item-subtitle>kharl112@gmail.com</v-list-item-subtitle>
        </v-list-item-content>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
    <v-divider />

    <v-list dense>
      <v-subheader>Requests</v-subheader>
      <v-list-item-group v-model="selected" color="#e78a00">
        <v-list-item v-for="(child, i) in items" :key="i">
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

      <v-list-item link>
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
