<script>
import Original from "./contents/Original";
import Mailing from "./contents/Mailing";
import PassSlip from "./contents/PassSlip";
export default {
  name: "PreviewRequest",
  components: { Original, Mailing, PassSlip },
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
  <v-overlay :value="preview.show" :z-index="100" class="overlay">
    <v-sheet
      v-if="preview.data"
      elevation="1"
      max-width="470"
      width="95vw"
      height="99vh"
      color="white"
      class="pa-3 sheet"
    >
      <v-container fluid class="inner-sheet pb-10">
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
          <Mailing
            :preview="preview"
            v-if="preview.data.service_id === '60f62de769f7dd1017e2ba4b'"
          />
          <PassSlip
            :preview="preview"
            v-else-if="(preview.data.service_id === '60f62dcb69f7dd1017e2ba49')"
          />
          <Original v-else :preview="preview" />
        </v-row>
      </v-container>
    </v-sheet>
  </v-overlay>
</template>
<style scoped>
.inner-sheet {
  border: 2px solid black;
}
.sheet {
  overflow-y: scroll;
  
}
</style>
