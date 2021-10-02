<script>
export default {
  name: "ConfirmLogout",
  props: {
    logout: Boolean,
    showLogout: Function,
  },
  computed: {
    getUserType() {
      return this.$route.fullPath.split("/")[1];
    },
  },
  methods: {
    handleLogout() {
      localStorage.removeItem("Authorization");
      return this.$router.replace(`/${this.getUserType}/login`);
    },
  },
};
</script>
<template>
  <v-overlay :value="logout" :z-index="100">
    <v-card
      :light="!$vuetify.theme.dark"
      min-width="250"
      max-width="300"
      class="px-4 py-6"
    >
      <p class="subtitle">
        Are you sure you want to logout?
      </p>
      <v-container fluid>
        <v-row justify="space-around" align="center">
          <v-btn small elevation="0" @click="handleLogout" color="primary">
            Yes, Log me out
          </v-btn>
          <v-btn small outlined color="primary" @click="showLogout">
            Cancel
          </v-btn>
        </v-row>
      </v-container>
    </v-card>
  </v-overlay>
</template>
