<script>
import pdf from "vue-pdf";

export default {
  name: "PreviewRequest",
  components: { pdf },
  props: {
    preview: Object,
    user_type: String,
    showPreview: Function,
    showUpload: Function,
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
    getFullName(name) {
      const { firstname, lastname, prefix } = name;
      return `${prefix ? `${prefix}.` : ""} ${firstname} ${lastname} `;
    },
    getDate(date) {
      const new_date = new Date(date);
      const month = new_date.toLocaleString("default", { month: "long" });
      return `${month} ${new_date.getDate()}, ${new_date.getFullYear()}`;
    },
    getTime(date) {
      const new_date = new Date(date);
      return new_date.toLocaleTimeString();
    },
    goToDrive(drive_id) {
      window
        .open(
          `https://drive.google.com/drive/u/2/folders/${drive_id}`,
          "_blank"
        )
        .focus();
    },
  },
  mounted() {
    if (this.preview.data._id)
      this.$store.dispatch("pdf/previewPDF", {
        user_type: this.user_type || "faculty",
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
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    color="primary"
                    :disabled="getLoading.mark"
                    @click="$router.push(`/track/${preview.data._id}`)"
                  >
                    <v-icon>
                      mdi-map-marker-distance
                    </v-icon>
                  </v-btn>
                </template>
                <span>Track request</span>
              </v-tooltip>

              <v-tooltip bottom v-if="markAsCompleted">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-if="preview.data.status === 0 && isSigned(preview.data)"
                    icon
                    v-bind="attrs"
                    v-on="on"
                    color="success"
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
            <v-skeleton-loader type="article, article, actions" light />
          </v-col>
          <v-container
            fluid
            :class="
              !showSignature && !showUpload && !preview.data.options.file
                ? 'absolute-container files-unavailable'
                : 'absolute-container'
            "
          >
            <v-btn
              v-if="showUpload"
              class="ma-2"
              small
              elevation="0"
              @click="showUpload"
            >
              <v-icon left>
                mdi-upload
              </v-icon>
              Upload a file
            </v-btn>
            <v-btn
              v-if="showSignature"
              color="primary"
              @click="showSignature(preview.data._id)"
              elevation="0"
              small
              class="ma-2"
            >
              <v-icon left>
                mdi-signature-freehand
              </v-icon>
              Sign this request
            </v-btn>
            <v-container
              fluid
              v-else-if="
                !showSignature && !showUpload && preview.data.options.file
              "
            >
              <v-row justify="start" align="center">
                <v-col cols="3">
                  <v-img
                    src="../../../../../assets/images/gdrive_logo.png"
                    alt="google drive logo"
                    max-width="80px"
                    min-width="40px"
                  />
                </v-col>
                <v-col>
                  <v-container
                    fluid
                    class="py-0 google-drive-container"
                    v-if="preview.data.options.file"
                    @click="goToDrive(preview.data.options.file.directory_id)"
                  >
                    <v-row justify="start">
                      <v-col cols="12" class="pa-0">
                        <span class="text--primary body-1">
                          Your files are ready
                          <v-icon color="primary" size="20" class="mb-1">
                            mdi-open-in-new
                          </v-icon>
                        </span>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <small class="text--secondary caption text-description">
                          Your files was uploaded by
                          <span class="font-weight-bold"
                            >{{
                              getFullName(
                                preview.data.options.file.last_uploader.name
                              )
                            }}
                          </span>
                          in
                          <span class="font-weight-bold">
                            {{
                              getDate(preview.data.options.file.last_modified)
                            }}
                          </span>
                          at
                          {{
                            getTime(preview.data.options.file.last_modified)
                          }}.
                        </small>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
            <v-container
              fluid
              v-else-if="
                !showSignature && !showUpload && !preview.data.options.file
              "
            >
              <v-row justify="start" align="center">
                <v-col cols="3">
                  <v-img
                    src="../../../../../assets/images/gdrive_logo.png"
                    alt="google drive logo"
                    max-width="80px"
                    min-width="40px"
                  />
                </v-col>
                <v-col>
                  <v-container fluid class="py-0">
                    <v-row justify="start">
                      <v-col cols="12" class="pa-0">
                        <span class="text--primary body-1">
                          No files available for this request
                        </span>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <small class="text--primary caption text-description">
                          Stay in touch, your files are not uploaded yet in the
                          google drive.
                        </small>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </v-container>
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
.absolute-container {
  overflow-x: scroll;
  position: absolute;
  bottom: 0px;
  left: 0px;
  background-color: white;
  box-shadow: 1px 1px 10px gray;
  padding: 15px 5px 5px 5px;
}
.google-drive-container {
  width: 100%;
  cursor: pointer;
}
.text-description {
  line-height: normal;
}
.files-unavailable {
  background-color: #e2e2e2;
  box-shadow: none;
}
</style>
