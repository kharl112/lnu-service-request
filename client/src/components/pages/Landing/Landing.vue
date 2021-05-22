<script>
export default {
  name: "Landing",
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
  </v-container>
</template>
