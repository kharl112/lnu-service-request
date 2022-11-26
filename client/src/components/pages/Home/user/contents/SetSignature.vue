<script>
import svgSketch from "vue-svg-sketch";
export default {
  name: "SetSignature",
  props: {
    data: Object,
    hideAndSeekSignature: Function,
    handleSetSignature: Function,
  },
  components: {
    svgSketch,
  },
  data: () => ({
    remarks: null,
    hideSignatures: false,
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
    handleSubmit() {
      if (this.$refs.sketch.getJSON().paths[0]) {
        if (this.handleSetSignature) {
          this.handleSetSignature("signature", this.hideSignatures);
          return this.hideAndSeekSignature();
        }
        const signature = document
          .getElementById("signature")
          .innerHTML.toString()
          .replace('height="300"', 'height="175" viewBox="0 0 300 175"');

        this.$store.dispatch("request/Sign", {
          _id: this.$route.params._id,
          form: { signature, remarks: this.remarks },
          user_type: "provider",
        });

        this.hideAndSeekSignature();
      }
    },
  },
};
</script>
<template>
  <v-overlay :value="data.shown" :z-index="100">
    <v-card class="pa-4" max-width="400" light outlined>
      <v-row dense no-gutters justify="start" justify-sm="center">
        <v-col cols="12">
          <v-row justify="end">
            <v-btn
              @click="hideAndSeekSignature"
              icon
              color="error"
              class="mb-2"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-col>
        <v-col cols="12" class="ma-1">
          <svg-sketch
            ref="sketch"
            id="signature"
            :disabled="signature.disabled"
            :size="signature.size"
            :color="signature.color"
          />
        </v-col>
        <v-col cols="12" class="ma-1" v-if="!handleSetSignature">
          <v-textarea
            rows="2"
            v-model="remarks"
            outlined
            label="Remarks (optional)"
          />
        </v-col>
        <v-col cols="12" class="pa-0">
          <v-switch
            label="Hide my signature"
            v-model="hideSignatures"
          ></v-switch>
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
                    @click="handleSubmit"
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
#signature {
  border: 1px solid gray;
  svg {
    border: none;
    height: 175px;
    width: 100%;
  }
}
</style>
