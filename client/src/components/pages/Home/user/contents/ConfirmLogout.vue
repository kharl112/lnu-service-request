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
      sessionStorage.clear();
      return this.$router.replace(`/${this.getUserType}/login`);
    },
  },
};
</script>
<template>
  <v-overlay :value="logout" :z-index="100">
    <v-card light max-width="344">
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">
            LOGOUT
          </div>
          <v-list-item-title class="headline mb-2">
            You are about to logout
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-btn @click="handleLogout" color="primary">
          Confirm
        </v-btn>
        <v-btn outlined color="warning" @click="showLogout">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
