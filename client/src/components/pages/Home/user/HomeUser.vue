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
      <SideNav />
      <v-col class="home-col1">
        <v-container fluid class="home-container2">
          <v-row justify="stretch" align="stretch" class="home-row2">
            <v-container fluid class="home-container3"> </v-container>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
@import "../../../../assets/scss/pages/Home/home.scss";
</style>
