<script>
export default {
  name: "Landing",
  data() {
    return {
      deferredPrompt: null,
    };
  },
  created() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
  },
  methods: {
    async dismiss() {
      this.deferredPrompt = null;
    },
    async install() {
      this.deferredPrompt.prompt();
    },
  },
};
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <router-link to="/faculty/login">Login as faculty</router-link>
      </v-col>
      <v-col cols="12">
        <router-link to="/admin/login">Login as admin</router-link>
      </v-col>
    </v-row>
    <v-banner v-if="deferredPrompt" color="info" dark class="text-left">
      Get our free app. It won't take up space on your device
      <template v-slot:actions>
        <v-btn text @click="dismiss">Dismiss</v-btn>
        <v-btn text @click="install">Install</v-btn>
      </template>
    </v-banner>
  </v-container>
</template>
