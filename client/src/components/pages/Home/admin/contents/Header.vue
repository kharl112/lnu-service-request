<script>
export default {
  name: "Header",
  computed: {
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
    handleRefresh() {
      return location.reload();
    },
  },
};
</script>
<template>
  <v-container fluid class="pa-0">
    <v-row justify="end" align="center" class="pa-2">
      <v-col cols="12" align="end" justify="end">
        <v-row justify="end" align="end">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="warning"
                class="mr-2"
                icon
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
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="success"
                class="mr-2"
                icon
                @click="handleRefresh"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="30">mdi-cached</v-icon>
              </v-btn>
            </template>
            <span>Refresh</span>
          </v-tooltip>
          <v-col cols="12">
            <v-divider />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
