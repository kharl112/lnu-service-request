<script>
import pdf from "vue-pdf";

export default {
  name: "PreviewRequest",
  components: { pdf },
  props: {
    preview: Object,
    showPreview: Function,
    downloadPDF: Function,
    showSignature: Function,
    markAsCompleted: Function,
    markAsArchive: Function,
  },
  data: () => ({
    currentPage: 0,
    pageCount: 0,
  }),
  computed: {
    getPDFLoading() {
      return this.$store.getters["pdf/getLoading"];
    },
    getBlobURL() {
      return this.$store.getters["pdf/getBlobURL"];
    },
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
  },
  methods: {
    isSigned(service_request) {
      const { admin, service_provider } = service_request;
      if (service_provider.staff_id)
        return !!admin.signature && !!service_provider.signature;
      return !!admin.signature;
    },
  },
  mounted() {
    if (this.preview.data._id)
      this.$store.dispatch("pdf/previewPDF", {
        user_type: "faculty",
        id: this.preview.data._id,
      });
  },
};
</script>
<template>
  <v-overlay :value="preview.show" :z-index="100" class="overlay">
    <v-sheet
      v-if="preview.data"
      elevation="1"
      width="75vw"
      max-width="470px"
      height="95vh"
      max-height="600px"
      color="white"
      class="pa-3 sheet"
    >
      <v-container fluid class="inner-sheet">
        <v-row>
          <v-col cols="12">
            <v-row justify="end">
              <v-tooltip bottom v-if="markAsArchive">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-if="preview.data.status === 1"
                    icon
                    v-bind="attrs"
                    v-on="on"
                    color="warning"
                    :loading="getLoading.mark"
                    @click="markAsArchive(preview.data._id)"
                  >
                    <v-icon>
                      mdi-archive
                    </v-icon>
                  </v-btn>
                </template>
                <span>Archive</span>
              </v-tooltip>
              <v-tooltip bottom v-if="showSignature">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    color="success"
                    @click="showSignature(preview.data._id)"
                  >
                    <v-icon>
                      mdi-signature-freehand
                    </v-icon>
                  </v-btn>
                </template>
                <span>Sign request</span>
              </v-tooltip>
              <v-tooltip bottom v-if="markAsCompleted">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-if="preview.data.status === 0 && isSigned(preview.data)"
                    icon
                    v-bind="attrs"
                    v-on="on"
                    color="primary"
                    :loading="getLoading.mark"
                    @click="markAsCompleted(preview.data._id)"
                  >
                    <v-icon>
                      mdi-check-circle
                    </v-icon>
                  </v-btn>
                </template>
                <span>Mark as completed</span>
              </v-tooltip>
              <v-btn
                @click="downloadPDF(preview.data._id)"
                :loading="getPDFLoading.download"
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
          <v-col cols="12" v-if="!getPDFLoading.preview && getBlobURL">
            <v-row justify="center">
              <pdf
                :src="getBlobURL"
                class="pdf-mod"
                @num-pages="pageCount = $event"
                @page-loaded="currentPage = $event"
              />
            </v-row>
          </v-col>
          <v-col cols="12" v-else>
            <v-skeleton-loader
              type="article, article, actions"
              light
            />
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-overlay>
</template>
<style scoped>
.sheet {
  overflow-y: scroll;
  overflow-x: hidden;
}
.pdf-mod {
  width: 100%;
  height: content;
}
</style>
