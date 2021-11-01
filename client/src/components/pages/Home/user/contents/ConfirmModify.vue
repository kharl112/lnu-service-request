<script>
export default {
  name: "ConfirmModify",
  props: {
    data: Object,
    hideAndSeekModify: Function,
  },
  methods: {
    async handleSubmit() {
      await this.$store.dispatch("request/Mark", {
        _id: this.$route.params._id,
        mark_type: this.data.type,
      });
      this.hideAndSeekModify();
    },
  },
};
</script>
<template>
  <v-overlay :value="data.shown" :z-index="100">
    <v-card
      :light="!$vuetify.theme.dark"
      min-width="250"
      max-width="400"
      class="px-4 py-6"
    >
      <p class="subtitle px-5">
        Are you sure you want to mark as {{ data.type }} this request?
      </p>
      <v-container fluid class="px-5 mt-2">
        <v-row justify="space-around" align="center">
          <v-btn small elevation="0" @click="handleSubmit" color="primary">
            Confirm
          </v-btn>
          <v-btn small outlined @click="hideAndSeekModify" color="primary">
            Cancel
          </v-btn>
        </v-row>
      </v-container>
    </v-card>
  </v-overlay>
</template>
