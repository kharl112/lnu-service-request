<script>
export default {
  name: "App",
};
</script>

<template>
  <v-app>
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-main>
  </v-app>
</template>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition-duration: 200ms;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
