<script>
export default {
  name: "ConfirmModify",
  props: {
    data: Object,
    hideAndSeekModify: Function,
  },
  methods: {
    async handleSubmit() {
      if (this.data.type === "reject")
        await this.$store.dispatch("request/Reject", {
          request_id: this.$route.params._id,
          remarks: this.data.remarks,
        });
      else
        await this.$store.dispatch("request/Mark", {
          _id: this.$route.params._id,
          mark_type: this.data.type,
          remarks: this.data.remarks,
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
      class="pa-4 ma-2"
    >
      <v-card-text class="px-3 pb-0">
        <p class="text-body2 mb-0">
          Are you sure you want to mark as
          {{ data.type == "reject" ? data.type + "ed" : data.type + "d" }} this
          request?
        </p>
      </v-card-text>
      <v-col cols="12" class="p-0">
        <v-textarea
          rows="4"
          v-model="data.remarks"
          outlined
          label="Remarks (optional)"
          hide-details
        />
      </v-col>
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
