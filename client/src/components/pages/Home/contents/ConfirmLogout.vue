<script>
export default {
  name: "ConfirmLogout",
  props: {
    logout: Boolean,
    showLogout: Function
  },
};
</script>
<template>
  <v-overlay :value="logout" :z-index="1">
    <v-card class="mx-auto" max-width="344" outlined>
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
        <v-btn color="secondary">
          Confirm
        </v-btn>
        <v-btn color="primary" @click="showLogout">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
