<script>
export default {
  name: "App",
};
</script>

<template>
  <v-app>
    <v-main>
      <h1>Hello World</h1>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
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
