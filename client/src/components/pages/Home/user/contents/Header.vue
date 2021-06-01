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
    <v-row justify="end" align="end">
      <v-col cols="12" align="end">
        <v-row justify="end" align="end" class="pa-2">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="warning"
                class="mr-3"
                @click="darkmode ? (darkmode = false) : (darkmode = true)"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="30">
                  {{
                    !darkmode ? "mdi-moon-waning-crescent" : "mdi-weather-sunny"
                  }}
                </v-icon>
              </v-btn>
            </template>
            <span>Enable darkmode</span>
          </v-tooltip>
          <v-btn icon color="success" class="mr-3">
            <v-icon size="30">mdi-cached</v-icon>
          </v-btn>
          <v-btn
            @click="handleDeleteSelected"
            icon
            color="error"
            :disabled="!getSelected[0] && !getLoading.selected"
            class="mr-3"
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
          <v-col cols="12" class="pa-0 pt-2">
            <v-divider />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
