<script>
export default {
  name: "ConfirmModify",
  props: {
    data: Object,
    hideAndSeekModify: Function,
  },
  methods: {
    handleSubmit() {
      const { id, type } = this.data;
      console.log(id, type);
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
      <p class="subtitle">
        Are you sure you want to mark as {{ data.type }} this request?
      </p>
      <v-container fluid>
        <v-row justify="space-around" align="center">
          <v-btn small elevation="0" @click="handleSubmit" color="primary">
            Confirm
          </v-btn>
          <v-btn small outlined color="primary" @click="hideAndSeekModify">
            Cancel
          </v-btn>
        </v-row>
      </v-container>
    </v-card>
  </v-overlay>
</template>
