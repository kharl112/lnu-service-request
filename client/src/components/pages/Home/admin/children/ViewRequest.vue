<script>
import pdf from "vue-pdf";
import UploadFile from "../contents/UploadFile";
import SetSignature from "../contents/SetSignature";

export default {
  name: "ViewFile",
  components: { pdf, UploadFile, SetSignature },
  props: { user_type: String },
  data: () => ({
    signature_view: {
      shown: false,
    },
    upload_view: {
      shown: false,
    },
    doc_view: {
      currentPage: 0,
      pageCount: 0,
      shown: true,
    },
  }),
  computed: {
    req_info() {
      return this.$store.getters["request/getLetterInfo"];
    },
    getPDFLoading() {
      return this.$store.getters["pdf/getLoading"];
    },
    getBlobURL() {
      return this.$store.getters["pdf/getBlobURL"];
    },
    getSignatureLevel() {
      const { admin, service_provider } = this.$store.getters[
        "request/getLetterInfo"
      ];
      let level = 1;
      if (admin.signature) level++;
      if (service_provider.signature) level++;
      return level;
    },
  },
  methods: {
    getDate(date) {
      const new_date = new Date(date);
      const month = new_date.toLocaleString("default", { month: "long" });
      return `${month} ${new_date.getDate()}, ${new_date.getFullYear()}`;
    },
    getFullName(name) {
      const { firstname, lastname, prefix } = name;
      return `${prefix ? `${prefix}.` : ""} ${firstname} ${lastname} `;
    },
    hideAndSeekDoc() {
      this.doc_view.shown = !this.doc_view.shown;
    },
    hideAndSeekUpload() {
      this.upload_view.shown = !this.upload_view.shown;
    },
    hideAndSeekSignature() {
      this.signature_view.shown = !this.signature_view.shown;
    },
    copyToClipBoard() {
      var copy_id = document.getElementById("directory_id");
      console.log(copy_id);
      copy_id.select();
      copy_id.setSelectionRange(0, 99999);
      try {
        document.execCommand("copy");
        return this.$store.dispatch(
          "message/successMessage",
          "copied to clipboard"
        );
      } catch (error) {
        return this.$store.dispatch(
          "message/errorMessage",
          "something went wrong"
        );
      }
    },
    downloadPDF() {
      return this.$store.dispatch("pdf/generatePDF", {
        user_type: "admin",
        id: this.$route.params.id,
      });
    },
  },
  mounted() {
    this.$store.dispatch("pdf/previewPDF", {
      user_type: "admin",
      id: this.$route.params.id,
    });
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row justify="start">
      <v-col sm="6" md="5" class="pb-0">
        <v-row justify="center">
          <v-btn
            color="secondary"
            text
            elevation="0"
            small
            @click="hideAndSeekDoc"
            class="hidden-sm-and-up"
            v-if="!getPDFLoading.preview && getBlobURL"
          >
            <v-icon left>
              {{ doc_view.shown ? "mdi-eye-off" : "mdi-eye" }}
            </v-icon>
            {{ doc_view.shown ? "hide document" : "unhide document" }}
          </v-btn>
          <v-col cols="12" class="hidden-sm-and-up">
            <v-divider />
          </v-col>
          <v-col cols="12" v-if="doc_view.shown">
            <pdf
              v-if="!getPDFLoading.preview && getBlobURL"
              :src="getBlobURL"
              class="pdf-mod"
              @num-pages="doc_view.pageCount = $event"
              @page-loaded="doc_view.currentPage = $event"
            />
            <v-skeleton-loader
              type="article, article, article, actions"
              light
              v-else
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="5" md="6">
        <v-row justify="start">
          <v-col cols="12">
            <v-subheader class="subtitle-1 pl-0 my-3 font-weight-bold">
              Request Information
            </v-subheader>
            <v-row justify="start">
              <v-col cols="12" class="py-1">
                <span class="caption">
                  Status:
                  {{
                    req_info.status === 0
                      ? "Pending"
                      : req_info.status === 1
                      ? "Completed"
                      : "Archived"
                  }}
                </span>
              </v-col>
              <v-col cols="12" class="py-1">
                <span class="caption">
                  Description:
                </span>
                <p class="caption py-0">
                  {{ req_info.subject }}
                </p>
              </v-col>
              <v-col cols="12" class="py-1">
                <span class="caption">
                  Purpose:
                </span>
                <p class="caption py-0">
                  {{ req_info.body }}
                </p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-2 pb-0">
            <v-divider />
          </v-col>
        </v-row>
        <v-row justify="start">
          <v-col cols="12">
            <v-subheader class="subtitle-1 font-weight-bold pl-0 my-3">
              Files
            </v-subheader>
            <v-row>
              <v-col cols="12" sm="6" class="py-1">
                <span class="caption">
                  Directory Status:
                  {{ req_info.options.file ? "Active" : "Not yet created" }}
                </span>
              </v-col>
              <v-col cols="12" sm="6" class="py-1">
                <span class="caption">
                  Last Modified:
                  {{
                    req_info.options.file
                      ? getDate(req_info.options.file.last_modified)
                      : "NA"
                  }}
                </span>
              </v-col>

              <v-col cols="12" sm="12" class="py-1">
                <span class="caption">
                  Last modifier:
                  {{
                    req_info.options.file
                      ? getFullName(req_info.options.file.last_uploader.name)
                      : "NA"
                  }}
                </span>
              </v-col>
              <v-col cols="12" sm="12" class="py-1">
                <span class="caption ">
                  Directory ID:
                </span>
                <v-icon
                  @click="copyToClipBoard"
                  class="ml-2 mr-1"
                  color="primary"
                  v-if="req_info.options.file"
                >
                  mdi-content-copy
                </v-icon>
                <input
                  @click="copyToClipBoard"
                  id="directory_id"
                  class="caption primary--text clickable-text"
                  v-if="req_info.options.file"
                  readonly
                  :value="req_info.options.file.directory_id"
                />
                <span class="caption" v-else>
                  NA
                </span>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-chip
                  small
                  :disabled="!req_info.options.file"
                  color="green"
                  label
                  text-color="white"
                >
                  <v-icon left>
                    mdi-google-drive
                  </v-icon>
                  View Files
                </v-chip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-7 pb-0">
            <v-divider />
          </v-col>
        </v-row>
        <v-row justify="start">
          <v-col cols="12" class="pb-7">
            <v-subheader class="subtitle-1 font-weight-bold pl-0 my-3">
              Tools
            </v-subheader>
            <v-row justify="space-between">
              <v-col class="py-1" v-if="getSignatureLevel === 1">
                <span
                  @click="hideAndSeekSignature"
                  class="caption text-no-wrap clickable-text primary--text"
                >
                  E-Signature
                </span>
              </v-col>
              <v-col class="py-1">
                <span
                  v-if="!getPDFLoading.download"
                  @click="downloadPDF"
                  class="caption text-no-wrap clickable-text primary--text"
                >
                  Download PDF
                </span>
                <span
                  v-else
                  class="caption text-no-wrap disabled-clickable-text"
                >
                  Download PDF
                </span>
              </v-col>
              <v-col class="py-1">
                <router-link
                  :to="`/track/${$route.params.id}`"
                  class="caption text-no-wrap clickable-text primary--text"
                >
                  Track Request
                </router-link>
              </v-col>
              <v-col class="py-1" v-if="req_info.status !== 2">
                <span
                  @click="hideAndSeekUpload"
                  class="caption text-no-wrap clickable-text primary--text"
                >
                  Upload Files
                </span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <UploadFile
        v-if="upload_view.shown"
        :uploadVisibility="upload_view.shown"
        :request_obj="req_info"
        :showUpload="hideAndSeekUpload"
      />
      <SetSignature
        v-if="signature_view.shown"
        :data="signature_view"
        :hideAndSeekSignature="hideAndSeekSignature"
      />
    </v-row>
  </v-container>
</template>
<style scoped>
.doc-hide-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.clickable-text {
  text-decoration: none;
  font-weight: bold;
}
.disabled-clickable-text {
  color: gray;
  font-weight: bold;
}
.clickable-text:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
