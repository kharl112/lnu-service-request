<script>
import svgSketch from "vue-svg-sketch";
export default {
  name: "SetSignature",
  props: {
    signatureVisibility: Boolean,
    handleSetSignature: Function,
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
    handleSubmit(signatureId) {
      if (this.$refs.sketch.getJSON().paths[0]) {
        this.handleSetSignature(signatureId);
        return this.showSignature();
      }
      return;
    },
  },
};
</script>
<template>
  <v-overlay :value="signatureVisibility" :z-index="100">
    <v-card class="pa-4" light outlined>
      <v-row dense no-gutters justify="start" justify-sm="center">
        <v-col cols="12">
          <v-row justify="end">
            <v-btn @click="showSignature" icon color="error" class="mb-2">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-col>
        <v-col cols="12" class="ma-1">
          <svg-sketch
            ref="sketch"
            id="sketch"
            :disabled="signature.disabled"
            :size="signature.size"
            :color="signature.color"
          />
        </v-col>
        <v-col cols="12" class="pa-0">
          <v-container fluid class="pa-1">
            <v-row dense justify="start" class="pl-1 pa-sm-0" align="center">
              <v-col cols="12" class="pa-0">
                <v-btn-toggle>
                  <v-btn
                    @click="revert"
                    small
                    class="pl-4 pr-4"
                    outlined
                    color="secondary"
                  >
                    <v-icon>mdi-undo</v-icon>
                  </v-btn>
                  <v-btn
                    @click="clean"
                    small
                    class="pl-4 pr-4"
                    outlined
                    color="primary"
                  >
                    <v-icon>mdi-eraser</v-icon>
                  </v-btn>
                  <v-btn
                    small
                    class="pl-4 pr-4"
                    color="primary"
                    @click="handleSubmit('sketch')"
                  >
                    Confirm
                  </v-btn>
                </v-btn-toggle>
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
  border: 1px solid gray;
  svg {
    border: none;
    height: 175px;
    width: 100%;
  }
}
</style>
