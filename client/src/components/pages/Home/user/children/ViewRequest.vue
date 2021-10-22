<script>
import pdf from "vue-pdf";

export default {
  name: "ViewFile",
  components: { pdf },
  props: { user_type: String },
  data: () => ({
    currentPage: 0,
    pageCount: 0,
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
    copyToClipBoard() {
      var copy_id = document.getElementById("directory_id");
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
  },
  mounted() {
    const user_type =
      this.$route.params.user_type === "user"
        ? "faculty"
        : "provider";
    this.$store.dispatch("pdf/previewPDF", {
      user_type,
      id: this.$route.params.id,
    });
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row justify="start">
      <v-col cols="12" sm="6" md="5">
        <pdf
          v-if="!getPDFLoading.preview && getBlobURL"
          :src="getBlobURL"
          class="pdf-mod"
          @num-pages="pageCount = $event"
          @page-loaded="currentPage = $event"
        />
        <v-skeleton-loader
          type="article, article, article, actions"
          light
          v-else
        />
      </v-col>
      <v-col cols="12" sm="5" md="6">
        <v-row justify="start">
          <v-col cols="12">
            <v-subheader class="subtitle-1 pl-0 my-3">
              Request Information
            </v-subheader>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  hide-details
                  v-model="req_info.subject"
                  readonly
                  dense
                  label="Description"
                />
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  hide-details
                  v-model="req_info.body"
                  readonly
                  dense
                  label="Purpose"
                />
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  hide-details
                  :value="
                    req_info.status === 1
                      ? 'Pending'
                      : req_info.status === 2
                      ? 'Completed'
                      : 'Archived'
                  "
                  readonly
                  dense
                  label="Status"
                />
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  hide-details
                  :value="getDate(req_info.date)"
                  readonly
                  dense
                  label="Date Created"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="start">
          <v-col cols="12">
            <v-subheader class="subtitle-1 pl-0 my-3">
              Files
            </v-subheader>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  hide-details
                  :value="req_info.options.file ? 'Active' : 'Not yet created'"
                  readonly
                  dense
                  label="Directory status"
                />
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  hide-details
                  :value="
                    req_info.options.file
                      ? getDate(req_info.options.file.last_modified)
                      : 'NA'
                  "
                  readonly
                  dense
                  label="Last modified"
                />
              </v-col>

              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  hide-details
                  :value="
                    req_info.options.file
                      ? getFullName(req_info.options.file.last_uploader.name)
                      : 'NA'
                  "
                  readonly
                  dense
                  label="Last modifier"
                />
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  id="directory_id"
                  prepend-inner-icon="mdi-content-copy"
                  @click="copyToClipBoard"
                  hide-details
                  :value="
                    req_info.options.file
                      ? req_info.options.file.directory_id
                      : 'NA'
                  "
                  readonly
                  dense
                  label="Directory ID"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="start">
          <v-col cols="12">
            <v-subheader class="subtitle-1 pl-0 my-3">
              Tools
            </v-subheader>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
