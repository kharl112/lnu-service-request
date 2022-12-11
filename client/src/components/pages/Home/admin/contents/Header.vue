<script>
export default {
  name: "Header",
  computed: {
    getUnreadNotifCount() {
      return this.$store.getters["notification/getNotifications"]
        .filter(({ unread }) => unread)
        .length.toString();
    },
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
  created() {
    this.$store.dispatch("notification/notifications", {
      user_type: "admin",
      filter: null,
    });
  },
};
</script>
<template>
  <v-container fluid class="pa-0">
    <v-row justify="end" align-items="center">
      <v-col cols="12">
        <v-row justify="space-between" align-items="center" class="mt-4">
          <div v-if="isMobile">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="dark"
                  class="mr-3 ml-3"
                  @click="drawer = true"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="30"> mdi-menu </v-icon>
                </v-btn>
              </template>
              <span>Menu</span>
            </v-tooltip>
          </div>

          <div class="ml-5 hidden-sm-and-down">
            <v-row justify="center" align="center">
              <img
                src="../../../../../assets/images/logo-512x512.png"
                class="lnu-logo"
                style=""
                alt="LNU logo"
                title="Leyte Normal University logo"
              />
              <span class="font-weight-bold">LNU SERVICE REQUESTING APP</span>
            </v-row>
          </div>

          <div>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-badge
                  color="primary"
                  offset-x="-20"
                  offset-y="-1"
                  :content="getUnreadNotifCount"
                  size="small"
                />
                <v-btn
                  icon
                  color="primary"
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  to="/admin/home/notification?filter=all"
                >
                  <v-icon size="25"> mdi-bell </v-icon>
                </v-btn>
              </template>
              <span>
                You have {{ getUnreadNotifCount }} unread notifications
              </span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="warning"
                  class="ml-1"
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
              <span v-if="!darkmode">Turn-on Darkmode</span>
              <span v-else>Turn-off Darkmode</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="success"
                  class="mx-1"
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
<style scoped>
.lnu-logo {
  width: 3rem;
  height: auto;
  margin-right: 10px;
}
</style>
