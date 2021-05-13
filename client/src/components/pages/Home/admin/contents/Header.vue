<script>
export default {
  name: "Header",
  computed: {
    getLoading() {
      return this.$store.getters["token/getLoading"];
    },
  },
  methods: {
    handleSubmit() {
      return this.$store.dispatch("token/generateToken");
    },
  },
};
</script>
<template>
  <v-container fluid class="home-container3">
    <v-row justify="end" align="end">
      <v-col cols="auto" sm="2" md="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="handleSubmit"
              color="success"
              :loading="getLoading"
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
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped></style>
