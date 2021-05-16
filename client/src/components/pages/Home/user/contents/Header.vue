<script>
export default {
  name: "Header",
  methods: {
    handleDeleteSelected() {
      console.log(this.$store.getters["request/getSelected"]);
    },
  },
};
</script>
<template>
  <v-container fluid class="home-container3">
    <v-btn icon color="secondary">
      <v-icon>mdi-cached</v-icon>
    </v-btn>
    <v-btn @click="handleDeleteSelected" icon color="secondary">
      <v-icon>mdi-trash-can</v-icon>
    </v-btn>
  </v-container>
</template>
