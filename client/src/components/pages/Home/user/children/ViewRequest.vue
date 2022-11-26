<script>
import pdf from "vue-pdf";
import UploadFile from "../contents/UploadFile";
import SetSignature from "../contents/SetSignature";
import ConfirmModify from "../contents/ConfirmModify";

export default {
  name: "ViewFile",
  components: { pdf, UploadFile, SetSignature, ConfirmModify },
  props: { user_type: String },
  data: () => ({
    modify_view: {
      shown: false,
      type: null,
      id: null,
      description: null,
    },
    signature_view: {
      shown: false,
    },
    upload_view: {
      shown: false,
    },
    doc_view: {
      currentPage: 1,
      pageCount: 0,
      shown: true,
    },
  }),
  computed: {
    isMobile() {
      const mobile = window.matchMedia("(max-width: 600px)");
      return mobile.matches;
    },
    req_info() {
      return this.$store.getters["request/getInfo"];
    },
    pdfLoading() {
      return this.$store.getters["pdf/getLoading"];
    },
    blobUrl() {
      return this.$store.getters["pdf/getBlobURL"];
    },
    isProvider() {
      return this.$route.params.user_type === "provider";
    },
    isUser() {
      return this.$route.params.user_type === "user";
    },
    getSignatureLevel() {
      const { admin, service_provider } =
        this.$store.getters["request/getInfo"];
      let level = 1;
      if (admin.signature) level++;
      if (service_provider.signature) level++;
      if (!service_provider.staff_id) level++;
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
    hideAndSeekModify(type = null) {
      if (type) {
        return (this.modify_view = {
          shown: !this.modify_view.shown,
          id: this.$route.params.id,
          type,
        });
      }
      this.modify_view.shown = !this.modify_view.shown;
    },
    goToDrive() {
      if (this.req_info.options.file)
        return window.open(
          `https://drive.google.com/drive/u/4/folders/${this.req_info.options.file.directory_id}`,
          "_blank"
        ).location;
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
      const user_type =
        this.$route.params.user_type === "user"
          ? "faculty"
          : this.$route.params.user_type;

      return this.$store.dispatch("pdf/generatePDF", {
        user_type,
        id: this.$route.params._id,
      });
    },
  },
  mounted() {
    const user_type =
      this.$route.params.user_type === "user" ? "faculty" : "provider";
    this.$store.dispatch("pdf/previewPDF", {
      user_type,
      id: this.$route.params._id,
    });

    if (this.isMobile) this.doc_view.shown = false;
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
            v-if="!pdfLoading.preview && blobUrl"
          >
            <v-icon left>
              {{ doc_view.shown ? "mdi-eye-off" : "mdi-eye" }}
            </v-icon>
            {{ doc_view.shown ? "hide document" : "unhide document" }}
          </v-btn>
          <v-col cols="12" v-if="doc_view.shown">
            <pdf
              v-if="!pdfLoading.preview && blobUrl"
              :src="blobUrl"
              class="pdf-mod"
              :page="doc_view.currentPage"
              @num-pages="doc_view.pageCount = $event"
              @page-loaded="doc_view.currentPage = $event"
            />
            <v-skeleton-loader
              type="article, article, article, actions"
              light
              v-else
            />
            <v-pagination
              v-if="!pdfLoading.preview && blobUrl"
              v-model="doc_view.currentPage"
              :length="doc_view.pageCount"
            />
          </v-col>
          <v-col cols="12" class="hidden-sm-and-up">
            <v-divider />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6" md="7" class="px-7 px-md-3">
        <v-row justify="start">
          <v-col cols="12">
            <v-card class="mx-auto pb-5 pt-2 px-5 mt-10" outlined>
              <v-subheader class="text-h6 pl-0 my-3 font-weight-bold">
                Request Information
              </v-subheader>
              <v-row justify="start">
                <v-simple-table class="table-row">
                  <thead>
                    <tr>
                      <th class="text-left">Description</th>
                      <th class="text-left">Status</th>
                      <th class="text-left">Date Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="caption text-sm-body-2">
                        {{ req_info.subject }}
                      </td>
                      <td class="text-capitalize caption text-sm-body-2">
                        {{ req_info.reports.status }}
                      </td>
                      <td class="caption text-sm-body-2">
                        {{ getDate(req_info.reports.dates.created) }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
                <v-simple-table class="table-row" elevation="1">
                  <thead>
                    <tr>
                      <th class="text-left">PURPOSE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="caption text-sm-body-2">
                        {{ req_info.body }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="start">
          <v-col cols="12">
            <v-card class="mx-auto pb-5 pt-2 px-5" outlined>
              <v-subheader class="text-h6 font-weight-bold pl-0 my-3">
                Google Drive Files
              </v-subheader>
              <v-row>
                <v-simple-table class="table-row" elevation="1">
                  <thead>
                    <tr>
                      <th class="text-left">ID</th>
                      <th class="text-left">Directory Status</th>
                      <th class="text-left">Last Modified</th>
                      <th class="text-left">Last Person Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <v-text-field
                          @click="copyToClipBoard"
                          class="caption"
                          id="directory_id"
                          v-if="req_info.options.file"
                          readonly
                          :value="req_info.options.file.directory_id"
                          prepend-inner-icon="mdi-content-copy"
                        />
                        <span class="caption text-sm-body-2" v-else> NA </span>
                      </td>
                      <td class="caption text-sm-body-2">
                        {{
                          req_info.options.file ? "Active" : "Not yet created"
                        }}
                      </td>
                      <td class="caption text-sm-body-2">
                        {{
                          req_info.options.file
                            ? getDate(req_info.options.file.last_modified)
                            : "NA"
                        }}
                      </td>
                      <td class="caption text-sm-body-2">
                        {{
                          req_info.options.file
                            ? getFullName(
                                req_info.options.file.last_uploader.name
                              )
                            : "NA"
                        }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
                <v-col cols="12" sm="12" md="6">
                  <v-chip
                    :disabled="!req_info.options.file"
                    color="green"
                    label
                    text-color="white"
                    @click="goToDrive()"
                  >
                    <v-icon left> mdi-google-drive </v-icon>
                    View Files in Google Drive
                  </v-chip>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="start" v-if="req_info.reports.status !== 'rejected'">
          <v-col cols="12" class="pb-7">
            <v-card flat>
              <v-card-text>
                <v-row align="center" justify="center">
                  <v-btn-toggle>
                    <v-btn
                      @click="hideAndSeekSignature"
                      v-if="isProvider && getSignatureLevel === 2"
                    >
                      E-Signature
                      <v-icon right> mdi-signature </v-icon>
                    </v-btn>
                    <v-btn
                      title="Download as pdf"
                      :disabled="pdfLoading.download"
                      @click="downloadPDF"
                    >
                      <span class="hidden-sm-and-down">Download PDF</span>
                      <v-icon right>mdi-download</v-icon>
                    </v-btn>
                    <v-btn
                      title="Upload files to GoogleDrive"
                      @click="hideAndSeekUpload"
                      v-if="req_info.reports.status !== 'archived'"
                    >
                      <span class="hidden-sm-and-down">Upload</span>
                      <v-icon> mdi-folder-google-drive</v-icon>
                    </v-btn>
                    <v-btn :to="`/track?id=${$route.params._id}`">
                      <span class="hidden-sm-and-down">Track</span>
                      <v-icon right>mdi-map-marker-distance</v-icon>
                    </v-btn>
                    <v-btn
                      @click="hideAndSeekModify('complete')"
                      v-if="
                        req_info.reports.status === 'sent' &&
                        getSignatureLevel === 3
                      "
                    >
                      Mark as Completed
                      <v-icon right>mdi-check</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="req_info.reports.status === 'completed' && isUser"
                      @click="hideAndSeekModify('archive')"
                    >
                      Mark as Archived
                      <v-icon right>mdi-archive</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- 
        <v-row justify="start" v-if="req_info.reports.status !== 'rejected'">
          <v-col cols="12" class="pb-7">
            <v-card class="mx-auto pb-5 pt-2 px-5" outlined>
              <v-subheader class="text-h6 font-weight-bold pl-0 my-3">
                Tools
              </v-subheader>
              <v-row justify="space-between">
                <v-col
                  class="py-1"
                  v-if="isProvider && getSignatureLevel === 2"
                >
                  <v-btn
                    @click="hideAndSeekSignature"
                    small
                    outlined
                    color="light"
                  >
                    <v-icon left> mdi-signature </v-icon>
                    E-Signature
                  </v-btn>
                </v-col>
                <v-col class="py-1">
                  <v-btn
                    :disabled="pdfLoading.download"
                    @click="downloadPDF"
                    small
                    outlined
                    color="error"
                  >
                    <v-icon left>mdi-download</v-icon>
                    Download PDF
                  </v-btn>
                </v-col>
                <v-col class="py-1">
                  <v-btn
                    :to="`/track?id=${$route.params._id}`"
                    small
                    outlined
                    color="primary"
                  >
                    <v-icon left> mdi-map-marker-distance </v-icon>
                    Track Request
                  </v-btn>
                </v-col>
                <v-col
                  class="py-1"
                  v-if="req_info.reports.status !== 'archived'"
                >
                  <v-btn
                    @click="hideAndSeekUpload"
                    small
                    outlined
                    color="success"
                  >
                    <v-icon left> mdi-upload</v-icon>
                    Upload Files
                  </v-btn>
                </v-col>
                <v-col
                  class="mt-3"
                  v-if="
                    req_info.reports.status === 'sent' &&
                    getSignatureLevel === 3
                  "
                >
                  <v-btn
                    @click="hideAndSeekModify('complete')"
                    small
                    outlined
                    color="light"
                  >
                    Mark as Completed
                  </v-btn>
                </v-col>
                <v-col
                  class="mt-3"
                  v-if="req_info.reports.status === 'completed' && isUser"
                >
                  <v-btn
                    @click="hideAndSeekModify('archive')"
                    class="overline text-no-wrap clickable-text warning--text"
                    small
                    outlined
                    color="warning"
                  >
                    Mark as Archived
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        -->
      </v-col>
      <UploadFile
        v-if="upload_view.shown"
        :data="upload_view"
        :hideAndSeekUpload="hideAndSeekUpload"
      />
      <SetSignature
        v-if="signature_view.shown"
        :data="signature_view"
        :hideAndSeekSignature="hideAndSeekSignature"
      />
      <ConfirmModify
        v-if="modify_view.shown"
        :data="modify_view"
        :hideAndSeekModify="hideAndSeekModify"
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
.table-row {
  width: 100%;
}
</style>
