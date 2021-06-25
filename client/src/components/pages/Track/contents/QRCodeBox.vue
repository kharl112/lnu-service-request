<script>
export default {
  name: "QRCodeBox",
  props: {
    show: Boolean,
    showQR: Function,
  },
  created() {
    console.log(this.$route);
  },
};
</script>
<template>
  <v-overlay :value="show" :z-index="100">
    <v-card :light="!$vuetify.theme.dark" max-width="344">
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-2">
            QRCode Generated
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <img id="qr_image" />
      <v-card-actions>
        <v-btn @click="handleLogout" color="primary">
          Confirm
        </v-btn>
        <v-btn outlined color="warning" @click="showQR">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
