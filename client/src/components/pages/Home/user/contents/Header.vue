<script>
export default {
  name: "Header",
  computed: {
    getSelected() {
      return this.$store.getters["request/getSelected"];
    },
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getError() {
      return this.$store.getters["request/getError"];
    },
  },
  methods: {
    handleDeleteSelected() {
      return this.$store.dispatch("request/deleteSelected");
    },
  },
};
</script>
<template>
  <v-container fluid class="pa-0">
    <v-row justify="end" align="center" class="pa-2">
      <v-col cols="12" align="end">
        <v-btn icon color="secondary" size="30">
          <v-icon>mdi-cached</v-icon>
        </v-btn>
        <v-btn
          @click="handleDeleteSelected"
          icon
          color="error"
          :disabled="!getSelected[0] && !getLoading.selected"
        >
          <v-badge
            color="error"
            offset-x="-18"
            offset-y="-10"
            dot
            v-if="getSelected[0]"
          />
          <v-icon size="30">mdi-trash-can</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider />
  </v-container>
</template>
