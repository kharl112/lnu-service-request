<script>
export default {
  name: "ViewFile",
  computed: {
    getLetterInfo() {
      return this.$store.getters["request/getLetterInfo"];
    },
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    {{ JSON.stringify(getLetterInfo) }}
  </v-container>
</template>
