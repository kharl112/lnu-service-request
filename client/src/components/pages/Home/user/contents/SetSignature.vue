<script>
import svgSketch from "vue-svg-sketch";
export default {
  name: "SetSignature",
  props: {
    signatureVisibility: Boolean,
    showSignature: Function,
  },
  components: {
    svgSketch,
  },
  data: () => ({
    signature: {
      disabled: false,
      size: 1,
      color: "#000",
      json: "",
    },
  }),
  computed: {},
  methods: {
    revert() {
      this.$refs.sketch.revert();
    },
    clean() {
      this.$refs.sketch.clean();
    },
    getJSON() {
      const signature = document.getElementById("sketch").innerHTML;
      console.log(this.$refs.sketch.getJSON());
      return console.log(JSON.stringify(signature.toString()));
    },
  },
};
</script>
<template>
  <v-overlay :value="signatureVisibility" :z-index="100">
    <v-card id="card" light max-width="400" outlined>
      <v-row dense no-gutters justify="start" justify-sm="center">
        <v-col cols="12">
          <v-row justify="end">
            <v-btn @click="showSignature" icon color="error" id="close-button">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-col>
        <v-col cols="12">
          <svg-sketch
            ref="sketch"
            id="sketch"
            :disabled="signature.disabled"
            :size="signature.size"
            :color="signature.color"
          />
        </v-col>
        <v-col cols="12">
          <v-container fluid id="tools">
            <v-row dense no-gutters justify="start" aling="center">
              <v-col cols="3" sm="3" md="2">
                <v-btn @click="revert" icon color="secondary">
                  <v-icon>mdi-undo</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="3" sm="3" md="2">
                <v-btn @click="clean" icon color="secondary">
                  <v-icon>mdi-eraser</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn @click="getJSON" small color="primary" elevation="0">
                  confirm
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-card>
  </v-overlay>
</template>
<style lang="scss" scope>
#sketch {
  svg {
    border: 1px solid black;
    height: 175px;
    width: 100%;
  }
}
#card {
  padding: 10px 2px 10px 10px;
}
#close-button {
  margin: 5px 10px 15px;
}
</style>
