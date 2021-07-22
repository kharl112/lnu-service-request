<script>
import Original from "./contents/Original";
export default {
  name: "PreviewRequest",
  components: { Original },
  props: {
    preview: Object,
    showPreview: Function,
    downloadPDF: Function,
  },
  computed: {
    getPDFLoading() {
      return this.$store.getters["pdf/getLoading"];
    },
  },
};
</script>
<template>
  <v-overlay :value="preview.show" :z-index="100">
    <v-sheet
      v-if="preview.data"
      elevation="1"
      max-width="470"
      width="95vw"
      height="99vh"
      color="white"
    >
      <v-container fluid>
        <v-row>
          <v-col cols="12" class="pa-6">
            <v-row justify="end">
              <v-btn
                @click="downloadPDF(preview.data._id)"
                :loading="getPDFLoading"
                icon
                color="secondary "
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
              <v-btn @click="showPreview()" icon color="error">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-row>
          </v-col>
          <Original :preview="preview" />
        </v-row>
      </v-container>
    </v-sheet>
  </v-overlay>
</template>
<style scoped>
.pdf-sheet {
  overflow-y: scroll;
}
</style>
