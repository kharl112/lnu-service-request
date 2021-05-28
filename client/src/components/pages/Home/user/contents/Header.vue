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
    darkmode: {
      get() {
        return localStorage.getItem("darkmode") === "true";
      },
      set(value) {
        localStorage.setItem("darkmode", value);
        return location.reload();
      },
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
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="warning"
              class="mr-2"
              @click="darkmode ? (darkmode = false) : (darkmode = true)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark>
                {{
                  !darkmode ? "mdi-moon-waning-crescent" : "mdi-weather-sunny"
                }}
              </v-icon>
            </v-btn>
          </template>
          <span>Enable darkmode</span>
        </v-tooltip>
        <v-btn icon color="secondary" size="30" class="mr-2">
          <v-icon>mdi-cached</v-icon>
        </v-btn>
        <v-btn
          @click="handleDeleteSelected"
          icon
          color="error"
          :disabled="!getSelected[0] && !getLoading.selected"
          class="mr-2"
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
