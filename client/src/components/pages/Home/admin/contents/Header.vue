<script>
export default {
  name: "Header",
  computed: {
    getLoading() {
      return this.$store.getters["token/getLoading"];
    },
    getDarkMode() {
      return localStorage.getItem("darkmode") === "true";
    },
  },
  methods: {
    handleSubmit() {
      return this.$store.dispatch("token/generateToken");
    },
    setDarkMode(value) {
      return localStorage.setItem("darkmode", value);
    },
  },
};
</script>
<template>
  <v-container fluid class="pa-0">
    <v-row justify="end" align="center" class="pa-2">
      <v-col cols="12" align="end" justify="end">
        <v-col align-self="end">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                elevation="0"
                color="warning"
                class="mr-2"
                @click="getDarkMode ? setDarkMode(false) : setDarkMode(true)"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon dark>
                  {{
                    !getDarkMode
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
                @click="handleSubmit"
                color="success"
                :loading="getLoading"
                class="mr-2"
                elevation="0"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </template>
            <span>Generate Token</span>
          </v-tooltip>
        </v-col>
      </v-col>
    </v-row>
    <v-divider />
  </v-container>
</template>
