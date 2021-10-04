<script>
import QRCode from "qrcode";
export default {
  name: "QRCodeBox",
  props: {
    show: Boolean,
    showQR: Function,
  },
  data: () => ({
    options: {
      type: "image/jpeg",
      quality: 1,
      margin: 0,
      color: {
        dark: "#1976d2",
        light: "#ffffff",
      },
    },
  }),
  methods: {
    generateQR() {
      const url = `https://lnusr.herokuapp.com${this.$route.fullPath}`;
      this.options.color.light = this.$vuetify.theme.isDark
        ? "#1e1e1e"
        : "#ffffff";
      QRCode.toDataURL(url, this.options, (err, url) => {
        if (err) return;
        const image = document.getElementById("qr_image");
        image.src = url;
      });
    },
  },
  updated() {
    return this.generateQR();
  },
};
</script>
<template>
  <v-overlay :value="show" :z-index="100">
    <v-card
      :light="!$vuetify.theme.dark"
      max-width="344"
      min-width="200"
      class="ma-2"
    >
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" class="pa-2" align="center">
            <v-list-item-title class="subtitle-1 mb-2 pt-3">
              <span class="headline text-uppercase">Generated QR</span> 
            </v-list-item-title>
          </v-col>
          <v-col cols="12" class="pa-2" align="center">
            <img id="qr_image" />
          </v-col>
          <v-col cols="12" class="pa-2">
            <v-card-actions>
              <v-btn small outlined @click="showQR">
                Close
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-overlay>
</template>
<style scoped>
#qr_image {
  width: 40%;
  min-width: 230px;
  max-width: 300px;
}
</style>
