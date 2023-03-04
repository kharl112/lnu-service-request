<script>
export default {
  name: "Header",
  computed: {
    getUnreadNotifCount() {
      return this.$store.getters["notification/getNotifications"]
        .filter(({ unread }) => unread)
        .length.toString();
    },
    getDeleteSelected() {
      return this.$store.getters["request/getDeleteSelected"];
    },
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getError() {
      return this.$store.getters["request/getError"];
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
    handleDeleteSelected() {
      return this.$store.dispatch("request/DeleteSelected");
    },
    handleSendSelected() {
      return this.$store.dispatch("request/SendSelected");
    },
    handleRefresh() {
      return location.reload();
    },
  },
  created() {
    this.$store.dispatch("notification/notifications", {
      user_type: "faculty",
      filter: null,
    });
  },
};
</script>
<template>
  <v-container fluid class="pa-0">
    <v-row justify="end" align-items="center">
      <v-col cols="12" class="">
        <v-row
          justify="space-between"
          align-items="center"
          class="mt-4 pr-sm-5"
        >
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
                  to="/faculty/home/notification?filter=all"
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
                  icon
                  color="warning"
                  class="mx-1"
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
              <span v-if="!darkmode">Turn-on darkmode</span>
              <span v-else>Turn-off darkmode</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="success"
                  class="mx-1"
                  @click="handleRefresh"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="25">mdi-cached</v-icon>
                </v-btn>
              </template>
              <span>Refresh</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="handleDeleteSelected"
                  icon
                  color="error"
                  :disabled="
                    !getDeleteSelected[0] || getLoading.delete_selected
                  "
                  class="mx-1"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-badge
                    :color="getLoading.delete_selected ? '#bdbdbd' : 'error'"
                    offset-x="-18"
                    offset-y="-1"
                    v-if="getDeleteSelected[0]"
                    :content="getDeleteSelected.length"
                    size="small"
                  />
                  <v-icon size="25">mdi-trash-can</v-icon>
                </v-btn>
              </template>
              <span>Delete Selected Drafts</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="handleSendSelected"
                  icon
                  color="success"
                  :disabled="!getDeleteSelected[0] || getLoading.send_selected"
                  class="mx-1"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-badge
                    :color="getLoading.send_selected ? '#bdbdbd' : 'success'"
                    offset-x="-18"
                    offset-y="-1"
                    v-if="getDeleteSelected[0]"
                    :content="getDeleteSelected.length"
                    size="small"
                  />
                  <v-icon size="25">mdi-send</v-icon>
                </v-btn>
              </template>
              <span>Delete Selected Drafts</span>
            </v-tooltip>
          </div>
        </v-row>
        <v-col cols="12" class="pa-0 pt-5">
          <v-divider />
        </v-col>
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
