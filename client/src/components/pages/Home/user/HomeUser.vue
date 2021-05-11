<script>
import SideNav from "../contents/SideNav";
export default {
  name: "HomeUser",
  components: {
    SideNav,
  },
};
</script>
<template>
  <v-container fluid class="home-container">
    <v-row no-gutters dense class="home-row1">
      <v-col class="home-col1-left"> <SideNav /></v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
@import "../../../../assets/scss/pages/Home/home.scss";
</style>
