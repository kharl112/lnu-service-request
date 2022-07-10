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
      class="pa-4"
    >
      <v-card-text class="px-3 pb-0">
        <p class="text-h6">
          Are you sure you want to mark as {{ data.type }}d this request?
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn small elevation="0" @click="handleSubmit" color="primary">
          Confirm
        </v-btn>
        <v-btn small outlined @click="hideAndSeekModify" color="light">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
