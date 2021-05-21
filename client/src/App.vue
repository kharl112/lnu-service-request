<script>
export default {
  name: "App",
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
  <v-app>
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
      <v-banner v-if="deferredPrompt" color="info" dark class="text-left">
        Get our free app. It won't take up space on your device
        <template v-slot:actions>
          <v-btn text @click="dismiss">Dismiss</v-btn>
          <v-btn text @click="install">Install</v-btn>
        </template>
      </v-banner>
    </v-main>
  </v-app>
</template>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition-duration: 100ms;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
