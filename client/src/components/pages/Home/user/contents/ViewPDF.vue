<script>
import pdf from "vue-pdf";

export default {
  name: "ViewPDF",
  components: { pdf },
  props: { doc_view: Object, pdfLoading: Object, blobUrl: String },
  data: () => ({}),
};
</script>
<template>
  <v-col cols="12" v-if="doc_view.shown">
    <pdf
      v-if="!pdfLoading.preview && blobUrl"
      :src="blobUrl"
      class="pdf-mod"
      :page="doc_view.currentPage"
      @num-pages="doc_view.pageCount = $event"
      @page-loaded="doc_view.currentPage = $event"
    />
    <v-skeleton-loader type="article, article, article, actions" light v-else />
    <v-pagination
      v-if="!pdfLoading.preview && blobUrl"
      v-model="doc_view.currentPage"
      :length="doc_view.pageCount"
    />
    <v-container fluid class="mt-5">
      <v-row justify="center">
        <v-btn :href="blobUrl" small outlined color="error"
          >Download File <v-icon right>mdi-download</v-icon></v-btn
        >
      </v-row>
    </v-container>
  </v-col>
</template>
