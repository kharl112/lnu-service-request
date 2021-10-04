<script>
export default {
  name: "Header",
  computed: {
    drawer: {
      get() {
        return this.$store.getters["navigation/getDrawer"];
      },
      set(bool) {
        return this.$store.commit("navigation/setDrawer", bool);
      },
    },
    isMobile() {
      const mobile = window.matchMedia("(max-width: 780px)");
      return mobile.matches;
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
    handleRefresh() {
      return location.reload();
    },
  },
};
</script>
<template>
  <v-container fluid class="pa-0">
    <v-row justify="end" align="center">
      <v-col cols="12" align="center">
        <v-row
          justify="space-between"
          align="end"
          class="pa-2"
        >
          <div v-if="isMobile">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="gray"
                  class="mr-3"
                  @click="drawer = true"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="45">
                    mdi-menu
                  </v-icon>
                </v-btn>
              </template>
              <span>Menu</span>
            </v-tooltip>
          </div>
          <div class="ml-5 hidden-sm-and-down">
              <span>Chief Administration Office </span>
          </div>
          <div class="sm-ml-5">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="primary"
                  class="mr-3"
                  @click="$router.push('/track/none')"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="25">
                    mdi-map-marker-distance
                  </v-icon>
                </v-btn>
              </template>
              <span>Track a request</span>
            </v-tooltip>
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
                  <v-icon size="25">
                    {{
                      !darkmode
                        ? "mdi-moon-waning-crescent"
                        : "mdi-weather-sunny"
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
                  <v-icon size="25">mdi-cached</v-icon>
                </v-btn>
              </template>
              <span>Refresh</span>
            </v-tooltip>
          </div>
          <v-col cols="12">
            <v-divider />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
